import { createPresentationSchema } from "../../../schemas/presentation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const presentationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx, input }) => {
    try {
      const res = await ctx.prisma.presentation.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return res;
    } catch (error) {
      console.error(error);
      return;
    }
  }),
  create: protectedProcedure
    .input(createPresentationSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if queue is empty
      const queue = await ctx.prisma.queue.count({
        where: {
          presentation: {
            user: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      if (!queue) {
        await ctx.prisma.$transaction(async () => {
          const presentation = await ctx.prisma.presentation.create({
            data: {
              title: input.title,
              userId: ctx.session.user.id,
              idealTime: input.idealTime * 60, // Store as seconds
              flashcards: { createMany: { data: input.flashcards } },
            },
          });
          const createdQueue = await ctx.prisma.queue.create({
            data: {
              presentationId: presentation.id,
            },
          });
        });
      }
      // Queue should only have length of 1
      else {
      }
      return;
    }),
});

// export const attemptRouter = createTRPCRouter({
//   getAll: protectedProcedure.query(async ({ ctx }) => {
//     const first = await ctx.prisma.presentation.findFirst(
//       {
//         select: { id: true },
//         where: { userId: ctx.session.user.id }
//       }
//     );
//     return await ctx.prisma.attempt.findMany({
//       where: {
//         presentationId: first?.id
//       },
//     });
//   }),
// });