"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export default function Home() {

  const trpc = useTRPC()

  return;
  <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <Button>Invoke Background Job</Button>
  </div>;
}
