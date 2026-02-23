# FolioLab

A collaborative SWE grind workspace for tracking LeetCode problems, planning sprints, hunting job offers, and competing head-to-head — built with Svelte and Supabase.

## Features

- **Dashboard** — activity heatmap, streak tracking, and per-user stats
- **Problems** — shared LeetCode problem log with per-user status (done / review / todo) and notes
- **Planner** — Kanban board for weekly sprint tasks
- **Companies** — job application pipeline tracker
- **Notes** — shareable algorithm cheatsheets and study notes
- **The Lab** — live head-to-head coding races and weekly challenges

## Tech stack

- [Svelte 4](https://svelte.dev) + [Vite 5](https://vitejs.dev)
- [Supabase](https://supabase.com) — authentication (Google OAuth + email/password)
- Pure CSS with custom properties (no Tailwind)
- Fonts: Syne, Inter, Space Mono via Google Fonts

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/foliolab.git
cd foliolab
bun install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then copy your credentials:

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Enable Google OAuth (optional)

1. Create an OAuth client in [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI
3. In Supabase → **Authentication → Providers → Google**, paste the Client ID and Secret
4. In Supabase → **Authentication → URL Configuration**, add `http://localhost:5173` to Redirect URLs

### 4. Run locally

```bash
bun dev
```

App runs at `http://localhost:5173`.

## Project structure

```
src/
├── lib/
│   └── supabase.js       # Supabase client
├── components/
│   └── Sidebar.svelte    # Navigation
├── pages/
│   ├── Login.svelte      # Auth (Google OAuth + email)
│   ├── Dashboard.svelte
│   ├── Problems.svelte
│   ├── Planner.svelte
│   ├── Companies.svelte
│   ├── Notes.svelte
│   └── Lab.svelte
├── stores/
│   └── state.js          # Svelte stores (problems, tasks, users, etc.)
├── App.svelte             # Root — session management + routing
├── app.css                # Design system (CSS custom properties)
└── main.js
```
