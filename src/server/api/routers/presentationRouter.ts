import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
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