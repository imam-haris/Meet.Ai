import z from "zod";

export const meetingInsertSchemas = z.object({
    name: z.string().min(1, {message : "Name is required"}),
    agentId: z.string().min(1,{message: "AgentId is required"})
})

export const meetingsUpdateSchema = meetingInsertSchemas.extend({
    id: z.string().min(1,{message:"Id is required"})
})