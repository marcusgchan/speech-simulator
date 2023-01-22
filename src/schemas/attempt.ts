import { z } from "zod";

export const getAttemptSchema = z.object({
  id: z.number(),
  timeTake: z.number(),
  speech: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  presentationId: z.number(),
});
