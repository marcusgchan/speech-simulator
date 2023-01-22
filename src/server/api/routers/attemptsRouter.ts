import { z } from "zod";
import { getPresentationSchema } from "../../../schemas/presentation";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

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
  