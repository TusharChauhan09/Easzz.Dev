# 🚀 Easzz.Dev - AI-Powered Code Generation Platform

An intelligent code generation platform that uses AI agents to create and execute Next.js code in sandboxed environments. Built with Next.js 16, tRPC, Inngest, and E2B sandboxes.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Key Files Explained](#key-files-explained)

---

## 🎯 Overview

Easzz.Dev is a platform that allows users to describe what they want to build, and an AI agent automatically generates, writes, and executes the code in a secure sandboxed Next.js environment. The platform leverages:

- **AI Agents** (via Inngest Agent Kit) to understand and generate code
- **E2B Sandboxes** to safely execute and preview generated applications
- **tRPC** for type-safe API communication
- **Real-time code execution** with live preview URLs

---

## 🏗️ Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EASZZ.DEV PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           CLIENT LAYER                                  │ │
│  │  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐ │ │
│  │  │   page.tsx       │    │   client.tsx     │    │  UI Components   │ │ │
│  │  │   (Main UI)      │    │  (Data Display)  │    │  (shadcn/ui)     │ │ │
│  │  │                  │    │                  │    │                  │ │ │
│  │  │  ┌────────────┐  │    │  ┌────────────┐  │    │  • Button        │ │ │
│  │  │  │   Input    │  │    │  │   Query    │  │    │  • Input         │ │ │
│  │  │  │   Button   │  │    │  │   Result   │  │    │  • Card          │ │ │
│  │  │  └────────────┘  │    │  └────────────┘  │    │  • etc...        │ │ │
│  │  └────────┬─────────┘    └────────┬─────────┘    └──────────────────┘ │ │
│  │           │                       │                                    │ │
│  └───────────┼───────────────────────┼────────────────────────────────────┘ │
│              │                       │                                      │
│              │ invoke.mutate()       │ useSuspenseQuery()                   │
│              ▼                       ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          tRPC CLIENT LAYER                              │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  TRPCReactProvider (wraps app in layout.tsx)                    │   │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │   │ │
│  │  │  │ useTRPC()    │  │ QueryClient  │  │ httpBatchLink        │   │   │ │
│  │  │  │              │  │              │  │ (SuperJSON)          │   │   │ │
│  │  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      │ HTTP POST /api/trpc                  │
│                                      ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          tRPC SERVER LAYER                              │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  appRouter (_app.ts)                                            │   │ │
│  │  │  ┌──────────────────────────┐  ┌──────────────────────────────┐ │   │ │
│  │  │  │  invoke (mutation)       │  │  hello (query)               │ │   │ │
│  │  │  │  ───────────────────     │  │  ─────────────────            │ │   │ │
│  │  │  │  Triggers Inngest event  │  │  Returns greeting message    │ │   │ │
│  │  │  │  "test/hello.world"      │  │                              │ │   │ │
│  │  │  └──────────────────────────┘  └──────────────────────────────┘ │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      │ inngest.send()                       │
│                                      ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        INNGEST EVENT LAYER                              │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  /api/inngest (route.ts)                                        │   │ │
│  │  │  Serves Inngest functions via HTTP                              │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                   │                                     │ │
│  │                                   ▼                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  helloWorld Function (functions.ts)                             │   │ │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Event: "test/hello.world"                                │  │   │ │
│  │  │  │  Input: { value: string }                                 │  │   │ │
│  │  │  └───────────────────────────────────────────────────────────┘  │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI AGENT NETWORK                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      Agent Network (Inngest Agent Kit)                   ││
│  │  ┌────────────────────────────────────────────────────────────────────┐ ││
│  │  │  Network: "coding-agent-network"                                   │ ││
│  │  │  Max Iterations: 15                                                │ ││
│  │  │  Router: Returns codeAgent until summary is generated              │ ││
│  │  └────────────────────────────────────────────────────────────────────┘ ││
│  │                                    │                                     ││
│  │                                    ▼                                     ││
│  │  ┌────────────────────────────────────────────────────────────────────┐ ││
│  │  │  codeAgent (GPT-4.1)                                               │ ││
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │ ││
│  │  │  │  System Prompt: Senior software engineer in Next.js sandbox │  │ ││
│  │  │  │  Temperature: 0.1 (deterministic)                           │  │ ││
│  │  │  └──────────────────────────────────────────────────────────────┘  │ ││
│  │  │                                                                    │ ││
│  │  │  Tools Available:                                                  │ ││
│  │  │  ┌─────────────┐ ┌──────────────────┐ ┌─────────────┐              │ ││
│  │  │  │  terminal   │ │ createOrUpdateFile │ │  readFile   │             │ ││
│  │  │  │  ─────────  │ │ ────────────────── │ │  ────────   │             │ ││
│  │  │  │  Run shell  │ │ Write files to     │ │  Read files │             │ ││
│  │  │  │  commands   │ │ sandbox filesystem │ │  from sandbox│            │ ││
│  │  │  └─────────────┘ └──────────────────┘ └─────────────┘              │ ││
│  │  └────────────────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                      │                                      │
│                                      │ Tool Executions                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         E2B SANDBOX                                      ││
│  │  ┌────────────────────────────────────────────────────────────────────┐ ││
│  │  │  Template: "easzz-dev-nextjs-test"                                 │ ││
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │ ││
│  │  │  │  Pre-configured Next.js 15.3.3 Environment                  │  │ ││
│  │  │  │  • Shadcn/UI components pre-installed                       │  │ ││
│  │  │  │  • Tailwind CSS configured                                  │  │ ││
│  │  │  │  • Dev server running on port 3000                          │  │ ││
│  │  │  │  • Hot reload enabled                                       │  │ ││
│  │  │  └──────────────────────────────────────────────────────────────┘  │ ││
│  │  │                                                                    │ ││
│  │  │  Outputs:                                                          │ ││
│  │  │  • Sandbox URL (http://{sandbox-host}:3000)                        │ ││
│  │  │  • Generated files                                                 │ ││
│  │  │  • Task summary                                                    │ ││
│  │  └────────────────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Request Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION FLOW                               │
└──────────────────────────────────────────────────────────────────────────────┘

     ┌─────────┐
     │  USER   │
     └────┬────┘
          │
          │ 1. Types request in Input
          │    "Build a todo app"
          ▼
┌──────────────────┐
│    page.tsx      │
│  ┌────────────┐  │
│  │   Input    │──┼──────────────────────────────────────────────────────┐
│  │   Button   │  │                                                      │
│  └────────────┘  │                                                      │
└──────────────────┘                                                      │
          │                                                               │
          │ 2. Button click triggers                                      │
          │    invoke.mutate({ value: "Build a todo app" })               │
          ▼                                                               │
┌──────────────────┐                                                      │
│   tRPC Client    │                                                      │
│  (useMutation)   │                                                      │
└────────┬─────────┘                                                      │
          │                                                               │
          │ 3. HTTP POST to /api/trpc/invoke                              │
          ▼                                                               │
┌──────────────────┐                                                      │
│   tRPC Router    │                                                      │
│   (_app.ts)      │                                                      │
│                  │                                                      │
│  invoke mutation │                                                      │
└────────┬─────────┘                                                      │
          │                                                               │
          │ 4. inngest.send({                                             │
          │      name: "test/hello.world",                                │
          │      data: { value: "Build a todo app" }                      │
          │    })                                                         │
          ▼                                                               │
┌──────────────────┐                                                      │
│  Inngest Server  │                                                      │
│  (/api/inngest)  │                                                      │
└────────┬─────────┘                                                      │
          │                                                               │
          │ 5. Triggers helloWorld function                               │
          ▼                                                               │
┌─────────────────────────────────────────────────────────────────┐       │
│                    helloWorld Function                          │       │
│                                                                 │       │
│  ┌───────────────────────────────────────────────────────────┐  │       │
│  │ Step 1: Create E2B Sandbox                                │  │       │
│  │         Sandbox.create("easzz-dev-nextjs-test")           │  │       │
│  └───────────────────────────────────────────────────────────┘  │       │
│                           │                                     │       │
│                           ▼                                     │       │
│  ┌───────────────────────────────────────────────────────────┐  │       │
│  │ Step 2: Initialize AI Agent Network                      │  │       │
│  │         • codeAgent with GPT-4.1                          │  │       │
│  │         • Tools: terminal, createOrUpdateFile, readFile   │  │       │
│  └───────────────────────────────────────────────────────────┘  │       │
│                           │                                     │       │
│                           ▼                                     │       │
│  ┌───────────────────────────────────────────────────────────┐  │       │
│  │ Step 3: Run Agent Network                                 │  │       │
│  │         network.run("Build a todo app")                   │  │       │
│  │                                                           │  │       │
│  │    ┌─────────────────────────────────────────────────┐    │  │       │
│  │    │  Agent Loop (max 15 iterations)                 │    │  │       │
│  │    │  ┌─────────────────────────────────────────┐    │    │  │       │
│  │    │  │ 1. Agent analyzes task                  │    │    │  │       │
│  │    │  │ 2. Calls tools to:                      │    │    │  │       │
│  │    │  │    • Install packages (terminal)        │    │    │  │       │
│  │    │  │    • Write code (createOrUpdateFile)    │    │    │  │       │
│  │    │  │    • Read files (readFile)              │    │    │  │       │
│  │    │  │ 3. Iterates until task complete         │    │    │  │       │
│  │    │  │ 4. Generates <task_summary>             │    │    │  │       │
│  │    │  └─────────────────────────────────────────┘    │    │  │       │
│  │    └─────────────────────────────────────────────────┘    │  │       │
│  └───────────────────────────────────────────────────────────┘  │       │
│                           │                                     │       │
│                           ▼                                     │       │
│  ┌───────────────────────────────────────────────────────────┐  │       │
│  │ Step 4: Get Sandbox URL                                   │  │       │
│  │         sandbox.getHost(3000)                             │  │       │
│  └───────────────────────────────────────────────────────────┘  │       │
│                           │                                     │       │
└───────────────────────────┼─────────────────────────────────────┘       │
                            │                                             │
                            │ 6. Returns result:                          │
                            │    {                                        │
                            │      url: "http://sandbox-host:3000",       │
                            │      title: "Fragment",                     │
                            │      files: {...},                          │
                            │      summary: "..."                         │
                            │    }                                        │
                            ▼                                             │
                     ┌──────────────┐                                     │
                     │   Result     │◄────────────────────────────────────┘
                     │  Displayed   │
                     └──────────────┘
```

---

## 🛠️ Tech Stack

| Category             | Technology          | Purpose                           |
| -------------------- | ------------------- | --------------------------------- |
| **Framework**        | Next.js 16          | Full-stack React framework        |
| **Language**         | TypeScript          | Type-safe development             |
| **API Layer**        | tRPC                | End-to-end typesafe APIs          |
| **State Management** | TanStack Query      | Server state management           |
| **Background Jobs**  | Inngest             | Serverless event-driven functions |
| **AI Agent**         | Inngest Agent Kit   | AI agent orchestration            |
| **AI Model**         | OpenAI GPT-4.1      | Code generation                   |
| **Sandboxing**       | E2B                 | Secure code execution             |
| **Database**         | PostgreSQL + Prisma | Data persistence                  |
| **UI Components**    | shadcn/ui + Radix   | Component library                 |
| **Styling**          | Tailwind CSS        | Utility-first CSS                 |
| **Validation**       | Zod                 | Schema validation                 |

---

## 📦 Core Components

### 1. Frontend Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │   layout.tsx    │  │    page.tsx     │                   │
│  │   ───────────   │  │   ───────────   │                   │
│  │  Root layout    │  │  Main page with │                   │
│  │  with TRPC      │  │  input & button │                   │
│  │  Provider       │  │                 │                   │
│  └────────┬────────┘  └────────┬────────┘                   │
│           │                    │                            │
│           │                    │                            │
│           ▼                    ▼                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              TRPCReactProvider                      │    │
│  │  Provides tRPC context to entire app                │    │
│  │  • QueryClient for caching                          │    │
│  │  • tRPC client for API calls                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. API Layer

```
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              /api/trpc/[trpc]/route.ts              │    │
│  │  tRPC HTTP handler - processes all tRPC requests   │    │
│  └──────────────────────────┬──────────────────────────┘    │
│                             │                               │
│                             ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    appRouter                        │    │
│  │  ┌──────────────────┐  ┌──────────────────┐         │    │
│  │  │    invoke        │  │     hello        │         │    │
│  │  │   (mutation)     │  │    (query)       │         │    │
│  │  │                  │  │                  │         │    │
│  │  │  Sends event to  │  │  Returns simple  │         │    │
│  │  │  Inngest         │  │  greeting        │         │    │
│  │  └──────────────────┘  └──────────────────┘         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              /api/inngest/route.ts                  │    │
│  │  Inngest HTTP handler - serves Inngest functions    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Agent Layer

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT LAYER                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              helloWorld Function                    │    │
│  │                                                     │    │
│  │  Event Trigger: "test/hello.world"                  │    │
│  │                                                     │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │  Steps:                                       │  │    │
│  │  │  1. get-sandbox-id  - Create E2B sandbox      │  │    │
│  │  │  2. Agent runs      - Network executes agent  │  │    │
│  │  │  3. get-sandbox-url - Get preview URL         │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   codeAgent                         │    │
│  │                                                     │    │
│  │  Model: GPT-4.1 (temperature: 0.1)                  │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │  Tools:                                     │    │    │
│  │  │                                             │    │    │
│  │  │  ┌─────────────┐  Run shell commands        │    │    │
│  │  │  │  terminal   │  e.g., npm install         │    │    │
│  │  │  └─────────────┘                            │    │    │
│  │  │                                             │    │    │
│  │  │  ┌─────────────────────┐  Write files       │    │    │
│  │  │  │  createOrUpdateFile │  Updates state     │    │    │
│  │  │  └─────────────────────┘                    │    │    │
│  │  │                                             │    │    │
│  │  │  ┌─────────────┐  Read existing files       │    │    │
│  │  │  │  readFile   │  Returns content           │    │    │
│  │  │  └─────────────┘                            │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Easzz.Dev/
├── prisma/                          # Database schema & migrations
│   ├── schema.prisma                # Prisma schema (User, Post models)
│   ├── seed.ts                      # Database seeding
│   └── migrations/                  # SQL migrations
│
├── public/                          # Static assets
│
├── sanbox-templates/                # E2B sandbox configuration
│   └── nextjs/
│       ├── e2b.Dockerfile           # Sandbox Docker config
│       ├── e2b.toml                 # E2B template config
│       └── compile_page.sh          # Startup script
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout (TRPCProvider)
│   │   ├── page.tsx                 # Main page (Input + Button)
│   │   ├── client.tsx               # Client component example
│   │   ├── prompts.ts               # AI agent system prompt
│   │   ├── globals.css              # Global styles
│   │   └── api/
│   │       ├── inngest/
│   │       │   └── route.ts         # Inngest HTTP handler
│   │       └── trpc/
│   │           └── [trpc]/
│   │               └── route.ts     # tRPC HTTP handler
│   │
│   ├── components/
│   │   └── ui/                      # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── ... (40+ components)
│   │
│   ├── generated/
│   │   └── prisma/                  # Generated Prisma client
│   │
│   ├── hooks/
│   │   └── use-mobile.ts            # Mobile detection hook
│   │
│   ├── inngest/
│   │   ├── client.ts                # Inngest client instance
│   │   ├── functions.ts             # Inngest functions (helloWorld)
│   │   └── utils.ts                 # Sandbox utilities
│   │
│   ├── lib/
│   │   ├── db.ts                    # Prisma database client
│   │   └── utils.ts                 # Utility functions (cn)
│   │
│   └── trpc/
│       ├── client.tsx               # tRPC React client & provider
│       ├── init.ts                  # tRPC initialization
│       ├── query-client.ts          # TanStack Query client
│       ├── server.tsx               # Server-side tRPC
│       └── routers/
│           └── _app.ts              # Main tRPC router
│
├── components.json                  # shadcn/ui config
├── next.config.ts                   # Next.js config
├── package.json                     # Dependencies
├── prisma.config.ts                 # Prisma config
├── tailwind.config.ts               # Tailwind config
└── tsconfig.json                    # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Inngest account
- E2B account

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# E2B
E2B_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="localhost:3000"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# In a separate terminal, start Inngest dev server
npx inngest-cli@latest dev
```

### Development URLs

| Service            | URL                            |
| ------------------ | ------------------------------ |
| Next.js App        | http://localhost:3000          |
| Inngest Dev Server | http://localhost:8288          |
| tRPC API           | http://localhost:3000/api/trpc |

### E2B Sandbox Management

The project uses a custom E2B sandbox template for the Next.js environment.

#### Prerequisites

1. Install the E2B CLI:

```bash
npm install -g @e2b/cli
```

2. Login to your E2B account:

```bash
e2b auth login
```

#### Building the Sandbox Template

If you modify files in `sanbox-templates/nextjs/`, you must rebuild the template:

```bash
cd sanbox-templates/nextjs
e2b template build
```

This will update the template configuration and make the new environment available to your agents.

### Viewing Sandbox Output

When the AI agent successfully generates code:

1. The application calculates the Preview URL (`https://<sandbox-id>-3000.use.e2b.dev`).
2. This URL is returned to the frontend.
3. Click the generated link in the Chat UI to view the running application.

**Note on Localhost:**
The sandbox runs in the cloud. References to "localhost" (e.g., `localhost:3000`) inside the sandbox environment are exposed via the secure E2B tunnel URL. You do not access them via your local machine's `localhost:3000`. Instead, use the provided E2B URL.

---

## 📄 Key Files Explained

### `src/app/page.tsx`

Main user interface with input field and invoke button. When clicked, sends the user's request to the tRPC mutation.

### `src/trpc/routers/_app.ts`

tRPC router with two endpoints:

- `invoke` - Mutation that triggers Inngest event
- `hello` - Simple query for testing

### `src/inngest/functions.ts`

Core Inngest function that:

1. Creates E2B sandbox
2. Initializes AI agent with tools
3. Runs agent network
4. Returns sandbox URL and generated files

### `src/app/prompts.ts`

System prompt for the AI agent defining:

- Environment constraints
- Available tools
- Coding guidelines
- Output format requirements

### `src/inngest/utils.ts`

Utility functions for:

- Connecting to existing sandboxes
- Extracting assistant messages

---

## 🔍 Component Interaction Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                     COMPONENT RELATIONSHIPS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Input ──► page.tsx ──► tRPC Client ──► appRouter              │
│                                                │                    │
│                                                ▼                    │
│                                          inngest.send()             │
│                                                │                    │
│                                                ▼                    │
│                                       helloWorld Function           │
│                                                │                    │
│                           ┌────────────────────┼───────────────┐    │
│                           │                    │               │    │
│                           ▼                    ▼               ▼    │
│                     E2B Sandbox          AI Agent         Network   │
│                           │                    │               │    │
│                           │           ┌───────┴───────┐        │    │
│                           │           │               │        │    │
│                           ▼           ▼               ▼        │    │
│                      Files ◄── terminal   createFile  readFile │    │
│                           │                                    │    │
│                           └────────────────────────────────────┘    │
│                                                │                    │
│                                                ▼                    │
│                                         Sandbox URL                 │
│                                         + Files                     │
│                                         + Summary                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

```
┌─────────────────────┐       ┌─────────────────────┐
│        User         │       │        Post         │
├─────────────────────┤       ├─────────────────────┤
│ id       Int (PK)   │       │ id       Int (PK)   │
│ email    String (U) │◄──────│ authorId Int (FK)   │
│ name     String?    │  1:N  │ title    String     │
│ posts    Post[]     │       │ content  String?    │
└─────────────────────┘       │ published Boolean   │
                              │ author   User       │
                              └─────────────────────┘
```

---

## 🔧 Configuration Files

| File                 | Purpose                           |
| -------------------- | --------------------------------- |
| `components.json`    | shadcn/ui component configuration |
| `next.config.ts`     | Next.js configuration             |
| `prisma.config.ts`   | Prisma build configuration        |
| `tsconfig.json`      | TypeScript compiler options       |
| `eslint.config.mjs`  | ESLint rules                      |
| `postcss.config.mjs` | PostCSS plugins (Tailwind)        |

---

## 📝 Notes

- The AI agent uses **step functions** to break down work into trackable, retryable units
- The **network router** keeps running the agent until a `<task_summary>` is generated
- Files created by the agent are stored in **network state** for persistence
- The sandbox template includes a pre-configured Next.js environment with shadcn/ui

---

## 🎯 Future Improvements

- [ ] Add user authentication
- [ ] Implement persistent sandbox sessions
- [ ] Add real-time streaming of agent progress
- [ ] Create project templates gallery
- [ ] Add collaborative editing features

---

_Last updated: January 2026_
