import { z } from "zod";

export const getAttemptSchema = z.object({
  id: z.number(),
  timeTake: z.number(),
  speech: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  presentationId: z.number(),
});

export const addPresentationToPush = z.object({
  presentationId: z.string(),
  transcript: z.string(),
  dateCreated: z.date(),
  elapsedTime: z.number(),
});

export const deletePresentationToPush = z.object({
  presentationId: z.string(),
});
