import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
export const meetingsRouter = createTRPCRouter({
    //GET ONE AGENT
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeetings] = await db
            .select({
                ...getTableColumns(meetings),

            })
            .from(meetings)
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
    //GET MANY AGENT
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(1),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;
            // throw new TRPCError({code: "BAD_REQUEST"})
            const data = await db
                .select({
                    ...getTableColumns(meetings),

                })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
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