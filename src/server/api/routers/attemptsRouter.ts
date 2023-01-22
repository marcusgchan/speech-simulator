import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

  export const attemptRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
    const userid = ctx.session.user.id;
      console.log(userid);
      const first = await ctx.prisma.presentation.findFirst(
        {
          where: { userId: ctx.session.user.id }
        }
      );
      return await ctx.prisma.attempt.findMany({
        where: {
          presentationId: first?.id
        },
      });
    }),
  });
