import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { presentationRouter } from "./routers/presentationRouter";
import { attemptRouter } from "./routers/attemptsRouter";
import { queueRouter } from "./routers/queueRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  presentation: presentationRouter,
  queue: queueRouter,
  attempt: attemptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
