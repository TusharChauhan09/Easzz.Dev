// "use client";
import { Button } from "@/components/ui/button";
// import { useTRPC } from "@/trpc/client";
// import { caller } from "@/trpc/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";

export default async function Home() {
  // example : Client Component
  // const trpc = useTRPC();
  // trpc usage
  // const example  = trpc.hello.queryOptions({ text: "client component" });
  // console.log(example);
  // tanstack query usage + trpc usage
  // const { data  } = useQuery(trpc.hello.queryOptions({ text: "client component" }));
  //  console.log(data);

  // example : Server Component
  // const data = await caller.hello({ text: "server component" });

  // prefetching example - prefetch the same query that Client component will use
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({ text: "client component" })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
