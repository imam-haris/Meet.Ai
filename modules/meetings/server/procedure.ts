import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingInsertSchemas, meetingsUpdateSchema } from "../schema";
import { MeetingStatus } from "../types";
export const meetingsRouter = createTRPCRouter({
    //update a meeting
    update: protectedProcedure
            .input(meetingsUpdateSchema)
            .mutation(async ({ ctx, input})=>{
                const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id , input.id),
                        eq(meetings.userId ,ctx.auth.user.id),
                    )
                )
                .returning()
                if(!updatedMeeting){
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Meeting not found"
                    });
                }
                return updatedMeeting;
            }),
    //create a meeting
    create: protectedProcedure
            .input(meetingInsertSchemas)
            .mutation(async ({ input, ctx }) => {
                const [createdMeeting] = await db
                    .insert(meetings)
                    .values({
                        ...input,
                        userId: ctx.auth.user.id
                    })
                    .returning();
                    //TODO: CREATE STREAM CALL, UPSERT STREAM USER 
                return createdMeeting;
            }),
    //REMOVE THE MEETING
    remove: protectedProcedure
            .input(z.object({id:z.string()}))
            .mutation(async ({ ctx, input})=>{
                const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id , input.id),
                        eq(meetings.userId ,ctx.auth.user.id),
                    )
                )
                .returning()
                if(!removedMeeting){
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Meeting not found"
                    });
                }
                return removedMeeting;
            }),
    //GET ONE MEETING
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeetings] = await db
            .select({
                ...getTableColumns(meetings),
                agent : agents,
                duration: sql<number>`EXTRACT(EPOCH from (${meetings.endedAt} - ${meetings.startedAt}))` .as("duration"),
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId , agents.id))
            .where(and(
                eq(meetings.id, input.id),
                eq(meetings.userId, ctx.auth.user.id),
            )
            );
        if (!existingMeetings) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Meetings not found" });
        }
        return existingMeetings;

    }),
    //GET MANY MEETINGS
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(1),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId: z.string().nullish(),
            status: z.enum([
                MeetingStatus.Upcoming,
                MeetingStatus.Active,
                MeetingStatus.Cancelled,
                MeetingStatus.Completed,
                MeetingStatus.Processing
            ])
            .nullish(),
        }))
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search, status , agentId} = input;
            // throw new TRPCError({code: "BAD_REQUEST"})
            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH from (${meetings.endedAt} - ${meetings.startedAt}))` .as("duration"),

                })
                .from(meetings)
                .innerJoin(agents,eq(agents.id , meetings.agentId))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status , status) : undefined,
                        agentId ?eq(meetings.agentId , agentId):undefined
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents,eq(agents.id , meetings.agentId))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status , status) : undefined,
                        agentId ?eq(meetings.agentId , agentId):undefined
                    )
                )
            const totalPages = Math.ceil(total.count / pageSize);

            // await new Promise((resolve) => setTimeout(resolve, 2000));
            // throw new TRPCError({ code: "BAD_REQUEST"})
            return {
                items: data,
                total: total.count,
                totalPages,
            }

        }),



})