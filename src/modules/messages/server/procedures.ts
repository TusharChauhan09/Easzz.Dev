import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import { z } from "zod";
import { inngest } from "@/inngest/client";

export const messagesRouter = createTRPCRouter({
    getMany : baseProcedure
    .query(async ()=>{
        const messages = await prisma.message.findMany({
            orderBy : {
                createdAt : "desc",
            },
            include: {
                fragment : true,
            }
        });
        return messages;
    }),

    create: baseProcedure
    .input(
        z.object({
            Value: z.string().min(1,{message : "Message cannot be empty"}),
        }),
    )
    .mutation(async ({input})=>{
        const createdMessage = await prisma.message.create({
            data : {
                content : input.Value,
                role : "USER",
                type : "RESULT",
            }
        });

        await inngest.send({
            name : "test/hello.world",
            data : {value : input.Value}
        })

        return createdMessage;
    })
});
