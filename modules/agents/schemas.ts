import { z } from "zod";
export const agentsInsertSchemas = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    instructions: z.string().min(1, {message: "Instructions are required "})
});

export const agentsUpdateSchema = agentsInsertSchemas.extend({
    id: z.string().min(1, {message: "Id is required"})
});