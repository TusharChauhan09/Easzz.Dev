"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const page = () => {
  const trpc = useTRPC();
  const {data: messages} = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess : (data)=>{
      console.log("Message Created : ",data);
    }
  }));

  const [value, setValue] = useState("");
  return (
    <div className=" p-4 max-w-7xl mx-auto ">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />

      <Button onClick={() => createMessage.mutate({ Value : value })}>
        Create Message
      </Button>
      {
        JSON.stringify(messages, null, 2)
      }
    </div>
  );
};

export default page;
