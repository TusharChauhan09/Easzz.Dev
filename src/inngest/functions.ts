import { inngest } from "./client";

import { Agent, openai, createAgent } from "@inngest/agent-kit";

// Inngest Function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Agent Creation
    const codeAgent = createAgent({
      name: "codeAgent",
      system: "You are an expert NextJs Developer. You write readable and maintainable code. You write simple NextJs & React code snippets.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await codeAgent.run(
      ` Write the following snippets : ${event.data.value}`
    );

    console.log(`code: ${output}`);

    return { code: output };
  }
);
