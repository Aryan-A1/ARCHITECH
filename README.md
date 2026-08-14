# Architech

> **AI-first architectural visualization — from 2D floor plan to photorealistic 3D render in seconds.**

Architech is a web application that lets architects, interior designers, and homeowners upload a flat 2D floor plan and instantly receive a photorealistic, top-down 3D render powered by Google's Gemini image generation model. Projects are persisted privately per user using Puter's cloud infrastructure — no backend servers or accounts beyond Puter required.

---

## Intention

The core idea behind Architech is to **eliminate the gap between a floor plan sketch and a visualization**. Traditionally, converting a 2D floor plan to a 3D render requires expensive software, skilled operators, and hours of work. Architech reduces that to a single file upload.

The goal is an AI-first design environment where users can:
- Upload any 2D architectural floor plan (hand-drawn or CAD-exported)
- Receive an accurate, photorealistic top-down 3D render within seconds
- Compare the before and after side-by-side interactively
- Export the rendered image with one click
- Have all their projects automatically saved and retrievable

---

## User Workflow

```
1. Land on homepage
        │
        ▼
2. Sign in with Puter (OAuth — no passwords)
        │
        ▼
3. Upload a 2D floor plan image
   (JPG / PNG / WebP, drag-and-drop or click)
        │
        ▼
4. Project is saved privately to Puter KV store
   and images are hosted on Puter's static hosting
        │
        ▼
5. Redirected to the Visualizer page (/visualizer/:id)
        │
        ▼
6. Gemini 2.5 Flash generates a photorealistic
   top-down 3D render of the floor plan
        │
        ▼
7. View the render — compare with the original
   using the interactive before/after slider
        │
        ▼
8. Export the rendered image as a file download
        │
        ▼
9. Return to homepage — all past projects are listed
   and clickable to re-open the visualizer
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component framework |
| **React Router v8** | File-based routing, SSR support |
| **TypeScript** | Type safety across the entire codebase |
| **Vite** | Development server and build tool |
| **Tailwind CSS v4** | Utility-first styling |
| **Lucide React** | Icon library |
| **react-compare-slider** | Interactive before/after image comparison slider |

### AI & Backend
| Technology | Purpose |
|---|---|
| **Puter.js (`@heyputer/puter.js`)** | Auth, key-value store, filesystem, static hosting, and serverless worker routing — all in one SDK |
| **Puter Workers** | Serverless API routes (`/api/projects/save`, `/api/projects/list`, `/api/projects/get`) — no dedicated backend server |
| **Puter KV** | Per-user project metadata storage (persisted key-value pairs) |
| **Puter Hosting** | Per-user static subdomain for hosting uploaded and rendered images |
| **Google Gemini 2.5 Flash (`gemini-2.5-flash-image-preview`)** | AI image generation — converts a 2D floor plan image into a photorealistic top-down 3D render via `puter.ai.txt2img` |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Container packaging for deployment |
| **Puter OAuth** | User authentication — sign in/sign out without managing credentials |

---

## Project Structure

```
architech/
├── app/
│   ├── routes/
│   │   ├── home.tsx          # Landing page — upload + project history
│   │   └── visualizer.$id.tsx # Render view — AI generation + comparison + export
│   ├── root.tsx              # App shell, auth context provider
│   └── routes.ts             # Route definitions
├── components/
│   ├── Navbar.tsx            # Top navigation with auth controls
│   ├── Upload.tsx            # Drag-and-drop file upload with progress
│   └── ui/
│       └── Button.tsx        # Reusable button component
├── lib/
│   ├── ai.action.ts          # Gemini AI image generation logic
│   ├── constants.ts          # App constants + the AI rendering prompt
│   ├── puter.action.ts       # Puter SDK wrappers (auth, projects CRUD)
│   ├── puter.hoisting.ts     # Image upload to Puter static hosting
│   ├── puter.worker.js       # Serverless worker — API route handlers
│   └── utils.ts              # Helpers (URL checking, blob conversion, etc.)
├── type.d.ts                 # Global TypeScript type definitions
└── Dockerfile                # Container configuration
```

---

## The AI Rendering Prompt

Architech uses a carefully engineered system prompt sent to Gemini alongside each floor plan image. It instructs the model to:

- **Remove all text** — no labels, dimensions, or annotations in the output
- **Preserve geometry exactly** — walls, doors, and windows match the source plan
- **Produce a strict top-down orthographic view** — no perspective tilt
- **Apply realistic materials** — wood/tile floors, neutral daylight, subtle shadows
- **Map floor plan icons to furniture** — bed icons become rendered beds, kitchen icons become counters with a sink and stove, etc.

---

## Getting Started

### Prerequisites
- Node.js 20+
- A [Puter](https://puter.com) account (free)
- A deployed Puter Worker URL (set as `VITE_PUTER_WORKER_URL` in `.env.local`)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root:

```env
VITE_PUTER_WORKER_URL=https://your-worker-subdomain.puter.site
```

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t architech .
docker run -p 3000:3000 architech
```

---

## Key Design Decisions

- **No custom backend** — Puter Workers handle all server-side logic. This eliminates infrastructure overhead while keeping user data private per Puter account.
- **Per-user image hosting** — images are uploaded to each user's own Puter static hosting subdomain, keeping costs zero and data ownership with the user.
- **Client-side AI call** — `puter.ai.txt2img` runs the Gemini call from the client through Puter's AI gateway, so no API keys are ever exposed to the frontend.
- **Idempotent project creation** — a `useRef` guard on the home page prevents double-submission on rapid uploads.
