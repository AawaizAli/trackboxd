import { z } from "zod";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getMessage: publicProcedure.query(async () => {
    return "yo";
  }),
});

export type AppRouter = typeof appRouter;