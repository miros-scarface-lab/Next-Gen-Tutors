# Next Gen Tutors

Connecting students with the right tutors.

Next Gen Tutors is a tutoring service website that helps students and families discover tutoring support and contact the team. The repository contains the source for the frontend application (built with Vite + React + TypeScript) and is deployed to Vercel.

Live website

- 🌐 https://next-gen-tutors-eight.vercel.app

Contact

- 📘 Facebook: https://facebook.com/nextgentutors247
- 📧 Email: nextgentutors247@gmail.com
- 💬 WhatsApp: 01318126412
- 📞 Phone: 01626881259

Features

- Responsive informational website for a tutoring service
- Contact options for enquiries (email, phone, WhatsApp, Facebook)
- Deployed and served from Vercel

Tech stack

This project is primarily a TypeScript React frontend scaffolded with Vite. The repository's package.json indicates the following notable dependencies and tooling:

- Frontend: React + TypeScript
- Bundler / dev server: Vite
- Styling: Tailwind CSS + PostCSS + Autoprefixer
- Icons: lucide-react
- Backend / DB: Supabase (client: @supabase/supabase-js)
- Tooling: ESLint, TypeScript

Getting started (development)

1. Clone the repository

   git clone <your-github-repository-url>
   cd <repository-folder>

2. Install dependencies

   npm install

3. Run the development server

   npm run dev

Common scripts (from package.json)

- npm run dev — start the Vite dev server
- npm run build — build production assets
- npm run preview — locally preview production build
- npm run lint — run ESLint checks
- npm run typecheck — run TypeScript typecheck (no emit)

Environment variables

If the app uses Supabase (the repo depends on @supabase/supabase-js), you will typically need to configure environment variables for your Supabase project. Add these to your local .env (or to Vercel dashboard for production):

- VITE_SUPABASE_URL — your Supabase project URL
- VITE_SUPABASE_ANON_KEY — your Supabase anon/public key

(If your project uses different variable names, check the code for the exact names expected.)

Deployment

The live site is hosted on Vercel. To deploy your own copy:

1. Push the repository to GitHub.
2. Create a new Vercel project and import the repository.
3. Set any required environment variables in the Vercel project settings (for example, Supabase keys).
4. Deploy and verify the production URL.

Notes & next steps

- Update the Features list to match the functionality actually implemented in the code (the list above is a general description based on the repo's dependencies).
- Add a LICENSE file if you want to specify how others may use, modify, or distribute the project.

License

No license file is included in this repository. Add a LICENSE file if you want to make the project open source and specify reuse terms.
