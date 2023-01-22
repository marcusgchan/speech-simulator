import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { addAttemptToPushSchema } from "../../../schemas/attempt";

export const attemptRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const first = await ctx.prisma.presentation.findFirst({
      where: { userId: input },
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
  addAttemptToPush: protectedProcedure
    .input(addAttemptToPushSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.attemptsToPush.create({
        data: input,
      });
    }),
  getAttemptsToPush: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.attemptsToPush.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
