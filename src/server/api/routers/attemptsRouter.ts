import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  addPresentationToPush,
  deletePresentationToPush,
} from "../../../schemas/attempt";

export const attemptRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const first = await ctx.prisma.presentation.findFirst({
      where: { AND: [{ id: input }, { userId: ctx.session.user.id }] },
    });
    return await ctx.prisma.attempt.findMany({
      where: {
        presentationId: first?.id,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }),
  addPresentationToPush: protectedProcedure
    .input(addPresentationToPush)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.attempt.create({
        data: {
          speech: input.transcript,
          timeTaken: input.elapsedTime * 1000,
          presentationId: input.presentationId,
          createdAt: input.dateCreated,
        },
      });
      await ctx.prisma.presentationToPush.create({
        data: {
          presentationId: input.presentationId,
        },
      });
    }),
  getPresentationToPush: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.presentationToPush.findFirst({
      select: {
        presentationId: true,
      },
      where: {
        presentation: {
          userId: ctx.session.user.id,
        },
      },
    });
  }),
  deletePresentationToPush: protectedProcedure
    .input(deletePresentationToPush)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.presentationToPush.deleteMany({
        where: {
          AND: [
            { presentationId: input.presentationId },
            {
              presentation: {
                userId: ctx.session.user.id,
              },
            },
          ],
        },
      });
    }),
});
