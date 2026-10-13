# Next Gen Tutors

Next Gen Tutors is a modern tutoring marketplace and informational website designed to connect students and parents with qualified tutors. The app presents a polished marketing site, searchable tutor listings, tuition request workflows, and a lightweight admin/content management experience backed by Supabase.

## Live demo

- Production website: https://next-gen-tutors-eight.vercel.app

## Features

- Responsive tutoring website for student enquiries and lead generation
- Tutor directory with featured and searchable listings
- Tuition request form for parents and students
- CMS-driven content loaded from Supabase
- Admin panel for managing content and site configuration
- Contact and social CTA sections for WhatsApp, email, Facebook, and phone
- Vercel-ready frontend deployment

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- ESLint
- Lucide React icons

## Project structure

```text
Next-Gen-Tutors/
├── public/                  # Static assets
├── src/                     # Application source code
│   ├── components/          # Reusable UI sections and pages
│   ├── hooks/               # Data fetching hooks
│   ├── lib/                 # Shared libraries and Supabase client
│   ├── types/               # TypeScript types
│   ├── App.tsx              # App routing and page composition
│   ├── index.css            # Tailwind/global styles
│   └── main.tsx             # App entry point
├── supabase/                # Supabase-related config and schema
├── .env                     # Local environment variables (not committed in some setups)
├── .gitignore
├── eslint.config.js
├── index.html
├── netlify.toml
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/miros-scarface-lab/Next-Gen-Tutors.git
cd Next-Gen-Tutors
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The app uses these values in `src/lib/supabase.ts` to connect to Supabase.

### 4. Run the development server

```bash
npm run dev
```

The app should start locally via Vite and be available at the default local port (typically `http://localhost:5173`).

## Available scripts

```bash
npm run dev      # Start the local Vite dev server
npm run build    # Production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint checks
npm run typecheck # Run TypeScript validation
```

## Deployment

This project is set up for deployment on Vercel, and the repository includes a `vercel.json` configuration. For production deployments, make sure the required environment variables are added in the hosting dashboard.

## Notes

- The content is intentionally data-driven and pulls from Supabase tables such as `site_settings`, `tutors`, `testimonials`, and `quick_questions`.
- If you want to customize branding, contact details, hero copy, or other content, update the CMS data in Supabase or the related site settings.

## License

This repository does not currently include a license file. If you plan to distribute or reuse the project publicly, consider adding an appropriate open-source license such as MIT.
