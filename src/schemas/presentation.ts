import { z } from "zod";

export const createPresentationSchema = z.object({
  title: z.string().min(1),
  idealTime: z.number(),
  dateCreated: z.date(),
  flashcards: z
    .object({
      text: z.string(),
      rank: z.number(),
    })
    .array(),
});
