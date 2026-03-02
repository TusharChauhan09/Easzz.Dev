import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";
import { messagesRouter } from "@/modules/messages/server/procedures";

export const appRouter = createTRPCRouter({
  // Example: Inngest Event Invocation using trpc

  messages: messagesRouter,

  // fragment : fragmentRouter,

});
  
// export type definition of API 
export type AppRouter = typeof appRouter;
