import { z } from "zod";

export const getPresentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  idealTime: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  flashcards: z
    .object({
      id: z.string(),
      title: z.string(),
      rank: z.number(),
      createdAt: z.date(),
      presentationId: z.string(),
    })
    .array(),
  attempts: z
    .object({
      id: z.number(),
      timeTake: z.number(),
      speech: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      presentationId: z.number(),
    })
    .array(),
});
