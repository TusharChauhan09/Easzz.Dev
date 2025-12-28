"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Client() {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.hello.queryOptions({text:"client component"}));
    return(
        <div>{JSON.stringify(data)}</div>
    );
}