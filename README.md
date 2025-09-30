# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a906f620-49e1-46ac-b991-8e8c8e8e105d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a906f620-49e1-46ac-b991-8e8c8e8e105d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a906f620-49e1-46ac-b991-8e8c8e8e105d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Deploy Status Badge

This badge is automatically updated to reflect the current state of your latest production deployment. To create a status badge for a deployed branch, add the `?branch=` query parameter to the badge URL. You can use the markup snippet below to add it to your project README.

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c11048c-32c2-4d0b-af13-a7e5cfee318a/deploy-status)](https://app.netlify.com/projects/helpful-stroopwafel-3176a2/deploys)

## Using Neon Database with Netlify

To fetch data from your Neon database directly using the `@netlify/neon` package, you can use the following query:

```javascript
import { neon } from '@netlify/neon';

const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
```

Ensure that the `NETLIFY_DATABASE_URL` environment variable is properly configured in your Netlify project settings.
