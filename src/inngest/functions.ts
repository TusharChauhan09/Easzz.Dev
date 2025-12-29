import { inngest } from "./client";
import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { Sandbox } from '@e2b/code-interpreter';

import { getSandbox } from "./utils";
import { get } from "http";

// Inngest Function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    // Create a sandbox
    // get sandbox id
    const sandboxId = await step.run("get-sandbox-id", async () =>{
      // Create a new sandbox
      const sandbox = await Sandbox.create("easzz-dev-nextjs-test");
      return sandbox.sandboxId;
    })


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

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const sandboxHost = sandbox.getHost(3000);
      return `http://${sandboxHost}`;
    });

    console.log(`Sandbox URL: ${sandboxUrl}`);

    return { code: output , sandboxUrl };
  }
);
