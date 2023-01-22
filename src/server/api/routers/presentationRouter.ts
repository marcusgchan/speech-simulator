import { z } from "zod";
import { getPresentationSchema } from "../../../schemas/presentation";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

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
});
