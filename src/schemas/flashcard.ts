import { z } from "zod";

export const getFlashcardSchema = z.object({
  id: z.string(),
  title: z.string(),
  rank: z.number(),
  createdAt: z.date(),
  presentationId: z.string(),
});
