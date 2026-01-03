import { inngest } from "./client";
import { Agent, openai, createAgent, createNetwork } from "@inngest/agent-kit";
import { createTool } from "@inngest/agent-kit";

import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantMessageContent } from "./utils";

import { z } from "zod";
import { PROMPT } from "@/app/prompts";

// ! Inngest Function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // ! Create a sandbox
    //  get sandbox id
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // Create a new sandbox
      const sandbox = await Sandbox.create("easzz-dev-nextjs-test");
      return sandbox.sandboxId;
    });

    // ! Agent Creation
    const codeAgent = createAgent({
      name: "codeAgent",
      description: "An Expert coding agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description:
            "Used to run terminal commands in the code interpreter sandbox",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffer = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffer.stderr += data;
                  },
                });
                return result.stdout;
              } catch (err) {
                console.error(
                  `Command failed: ${err} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`
                );

                return `Command failed: ${err}\n stdout: ${buffer.stdout}\n stderr: ${buffer.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFile",
          description:
            "Creates or updates a file in the code interpreter sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run(
              "create-or-update-file",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (err) {
                  return `Error creating or updating files: ${err}`;
                }
              }
            );

            // Update network state after step completes
            if (typeof newFiles === "object") {
              // we dont want to store string in state
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFile",
          description: "Reads a file from the code interpreter sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (err) {
                return `Error reading files: ${err}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("</task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    // !  Network Creation
    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15, // max iterations (so that it doesn't run forever)
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    // old
    // const { output } = await codeAgent.run(
    //   ` Write the following snippets : ${event.data.value}`
    // );
    // console.log(`code: ${output}`);

    // ! new | Run Network
    const result = await network.run(event.data.value);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const sandboxHost = sandbox.getHost(3000);
      return `http://${sandboxHost}`;
    });

    console.log(`Sandbox URL: ${sandboxUrl}`);

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
