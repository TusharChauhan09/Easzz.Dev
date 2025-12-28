import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  // Example: Inngest Event Invocation using trpc
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async (opts) => {
      await inngest.send({
        name: "test/hello.world",
        data: { value: opts.input.value },
      });
    }),
    // Example: Trpc Query
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API 
export type AppRouter = typeof appRouter;
