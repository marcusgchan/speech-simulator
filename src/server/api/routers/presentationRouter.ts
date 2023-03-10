import { TRPCClientError } from "@trpc/client";
import {
  createPresentationSchema,
  getPresentationSchema,
  updatePresentationSchema,
} from "../../../schemas/presentation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const presentationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
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
          await ctx.prisma.queue.create({
            data: {
              presentationId: presentation.id,
            },
          });
        });
      }
      // Queue should only have length of 1
      else {
        throw new TRPCClientError("There is already a presentation queued!");
      }
    }),
  queueExistingPresentation: protectedProcedure
    .input(getPresentationSchema)
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
        await ctx.prisma.queue.create({
          data: {
            presentationId: input.id,
          },
        });
      } else {
        throw new TRPCClientError("There is already a presentation queued!");
      }
    }),
  getPresentation: protectedProcedure
    .input(getPresentationSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.presentation.findUnique({
        where: { id: input.id },
        include: {
          flashcards: true,
        },
      });
    }),
  update: protectedProcedure
    .input(updatePresentationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.flashcard.deleteMany({
        where: {
          presentationId: input.id,
        },
      });
      const flashcardWithNoId = input.flashcards.map((flashcard) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = flashcard;
        return rest;
      });
      await ctx.prisma.presentation.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          idealTime: input.idealTime,
          updatedAt: input.dateCreated,
          flashcards: {
            createMany: {
              data: [...flashcardWithNoId, ...input.moreFlashcards],
            },
          },
        },
      });
    }),
});
