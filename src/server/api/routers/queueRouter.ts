import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const queueRouter = createTRPCRouter({
  getQueueAndPresentation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx }) => {
      const query = await ctx.prisma.queue.findFirst({
        where: {
          presentation: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          presentation: {
            include: {
              flashcards: true,
            },
          },
        },
      });
      return query;
    }),
  deleteQueue: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.queue.delete({
        where: {
          id: input,
        },
      });
    }),
});
