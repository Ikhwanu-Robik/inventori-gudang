<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Antigravity Project Configuration (Branch `v1`)

## 1. Project Overview & Tech Stack
- **Framework**: Next.js 16.2.10 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `app/globals.css`)
- **Language**: TypeScript 5 (`tsconfig.json` with strict mode)
- **Branch**: `v1`

## 2. Vibe Coding Guidelines for Antigravity
- **Fast & Incremental**: Build features in modular, self-contained steps. Commit logical improvements early.
- **Type Safety**: Maintain strict TypeScript typing. Avoid `any` types or unsafe casting.
- **Next.js 16 Conventions**:
  - `params` and `searchParams` in page components are Promises (`await params`).
  - Next.js server functions like `cookies()` and `headers()` are async (`await cookies()`).
  - Default to Server Components (`RSC`). Use `'use client'` only for interactive client-side logic.
- **UI & Aesthetic Standards**:
  - Create polished, modern interfaces with high visual quality.
  - Utilize curated color palettes, dark/light theme support, and responsive layouts.
  - Avoid ugly default browser elements; use custom states, clear hover effects, and loading indicators.
- **Verification Protocol**:
  - Run `npm run type-check` to verify TypeScript clean state.
  - Run `npm run build` to confirm production compilation.

