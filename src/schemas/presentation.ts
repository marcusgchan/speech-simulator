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

export const updatePresentationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  idealTime: z.number(),
  dateCreated: z.date(),
  flashcards: z
    .object({
      id: z.string(),
      text: z.string(),
      rank: z.number(),
    })
    .array(),
  moreFlashcards: z
    .object({
      text: z.string(),
      rank: z.number(),
    })
    .array(),
});

export const getPresentationSchema = z.object({
  id: z.string(),
});
