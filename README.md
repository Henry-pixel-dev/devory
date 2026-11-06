# Devory

Devory is an AI-powered learning and resource management platform for discovering, saving, and organizing the materials you need to build new technical skills.

## Overview

Learning resources are often scattered across video platforms, documentation sites, repositories, and personal bookmarks. Devory brings those resources into one authenticated workspace.

With Devory, users can:

- Save links with automatically generated metadata and preview images.
- Organize resources into collections.
- Search, filter, sort, and favorite saved resources.
- Ask an AI assistant to find a learning resource, create a collection of videos, or outline a career-oriented learning path.

The application is designed around a simple learning workflow: discover useful material, keep it organized, and return to it when it is needed.

## Key Features

### Resource generation

The AI assistant asks for a topic and the learner's level, then generates a YouTube search query. Devory uses the YouTube Data API to find one embeddable video, retrieves its metadata, and lets the user save it as a resource.

Users can also add any link manually. Devory fetches Open Graph metadata for general URLs and uses YouTube oEmbed metadata for YouTube links.

### Collection generation

The assistant can generate a structured set of one to five complementary YouTube video recommendations around a topic. The videos are resolved through YouTube search and shown in recommended viewing order.

Separately, users can create collections manually and associate existing saved resources with them.

### Career path generation

The AI Career Guide asks for a target role or field and the learner's current level. It then creates a staged roadmap with three to five learning stages and one to two video recommendations per stage.

The roadmap is currently presented in the chat experience. The current chat flow does not yet save generated roadmaps as persistent dashboard data.

## How It Works

1. **Create an account** with email and password.
2. **Confirm the email address** using the Supabase confirmation link.
3. **Open the dashboard**, where Devory seeds starter collections and resources for a new user.
4. **Add resources** by pasting a URL or asking the AI assistant for a recommendation.
5. **Organize resources** into collections and mark important items as favorites.
6. **Use the Roadmapper** to generate a resource recommendation, a video collection, or a staged career path.
7. **Upgrade when needed** if the free resource or collection allowance has been reached.

## Free vs Premium

Devory uses a freemium model enforced by the server:

| Capability | Free plan | Premium plan |
| --- | ---: | ---: |
| Saved resources | Up to 40 | Unlimited |
| Collections | Up to 8 | Unlimited |
| AI resource generation | Available; saving the result uses the resource limit | Unlimited saved resources |
| AI collection generation | Available; collection persistence uses the collection limit | Unlimited collections |
| AI Career Guide | Available in the current UI; not currently plan-gated | Available |

The current limit checks are implemented in `lib/access.ts` and `lib/limits.ts`. Premium access is granted when the authenticated user's `profiles.plan` value is `premium`. The payment fulfillment helper currently writes `pro`, so the payment and access plan values should be reconciled before relying on the production upgrade flow.

## Tech Stack

- **Next.js 16** with the App Router
- **React 19** and **TypeScript**
- **Supabase** for authentication, PostgreSQL data access, storage, and server-side sessions
- **Google GenAI SDK** for Gemini-powered assistant responses
- **YouTube Data API v3** for video discovery
- **YouTube oEmbed and Cheerio** for link metadata and previews
- **Roqqu API** for generating USDT payment wallets
- **Tailwind CSS 4** with the Tailwind PostCSS plugin
- **React Icons** for interface icons
- **qrcode.react** for payment address QR codes
- **ESLint** and `eslint-config-next` for linting

## Project Structure

```text
app/
  page.tsx                    Public landing page
  layout.tsx                  Root layout and metadata
  api/                        Server-side API route handlers
    chat/                     Gemini assistant endpoint
    find/                     YouTube video search
    preview/                  Link metadata extraction
    resources/                Save resources
    collections/              Create collections
    upgrade/                  Create a USDT upgrade order
    upload-image/             Upload preview images to Supabase Storage
  auth/callback/              Supabase password-reset callback
  dashboard/                  Authenticated resource workspace
    resources/                Resource list and detail pages
    collections/              Collection list and detail pages
    favorite/                 Favorite resources
    roadmaps/                 AI Career Guide interface
  signin/                     Sign-in page
  signup/                     Account creation page
  forget-password/            Password reset request
  reset-password/             New password form
  verify-email/               Email confirmation instructions
  payment/success/            Payment status polling page

components/                   Reusable UI and client-side interactions
lib/
  supabase/                   Browser, server, and service-role clients
  access.ts                   Premium detection and free-plan limit checks
  limits.ts                   Free resource and collection limits
  getUser.ts                  Authenticated user and dashboard data queries
  seedUserData.ts             Starter data initialization
  roqqu.ts                    Roqqu wallet generation
  fulfil.ts                   Payment fulfillment helper
  types.ts                    Shared resource and collection types
public/                       Images, starter-pack assets, and landing-page media
next.config.ts                Next.js image remote-pattern configuration
package.json                  Scripts and dependencies
```

## Getting Started

### Prerequisites

- Node.js compatible with the project's Next.js and React versions.
- An npm installation.
- A Supabase project.
- Google Gemini, YouTube Data API, and Roqqu credentials for the related features.

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local `.env.local` file in the project root using the placeholders below. Do not commit this file.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
YOUTUBE_API_KEY=your-youtube-data-api-key
ROQQU_API_KEY=your-roqqu-api-key
ROQQU_MODE=test
```

`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `YOUTUBE_API_KEY`, and `ROQQU_API_KEY` are server-side secrets. Never expose them in client-side code or commit them to source control.

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Available scripts

```bash
npm run dev       # Start the Next.js development server
npm run build     # Create a production build
npm start         # Start the production server
npm run lint      # Run ESLint
```

## Environment Variables

| Variable | Required for | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Authentication and database | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Authentication and database | Supabase publishable key used by browser and server clients |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations and payments | Server-only Supabase service-role key |
| `GEMINI_API_KEY` | AI assistant | Google GenAI API key |
| `YOUTUBE_API_KEY` | AI video resolution | YouTube Data API v3 key |
| `ROQQU_API_KEY` | Upgrade flow | Roqqu API key |
| `ROQQU_MODE` | Upgrade flow | Set to `test` for staging headers or `live` for production headers |

The repository ignores `.env*` files through `.gitignore`.

## Authentication and Database

Authentication is implemented with Supabase Auth:

- The browser uses a Supabase SSR browser client.
- Server Components and route handlers use a cookie-aware Supabase server client.
- Sign-up creates an email/password account and sends an email confirmation link.
- Sign-in uses `signInWithPassword`.
- Password reset requests redirect through `/auth/callback`, which exchanges the recovery code for a session before opening `/reset-password`.
- Protected dashboard pages redirect unauthenticated users to `/signin`.

The application reads and writes the following Supabase resources:

- `profiles` for the user's access plan.
- `resources` for saved links and metadata.
- `collections` for user-created groups.
- `collection_resources` as the resource-to-collection join table.
- `orders` for upgrade payment orders.
- `purchases` for fulfilled purchases.
- `resource-images` as the Supabase Storage bucket for downloaded preview images.

Dashboard queries use the authenticated Supabase client, so database access should be protected with appropriate Supabase Row Level Security policies. The service-role client is reserved for server-side administrative operations such as payment order creation and fulfillment.

New users receive starter collections and resources from `lib/StarterPack.ts` through `lib/seedUserData.ts`. A `seeded` flag in the user's auth metadata prevents repeated seeding.

## AI Integration

The AI assistant is implemented in `app/api/chat/route.ts` with the Google GenAI SDK and the `gemini-3.5-flash-lite` model.

There are three validated modes:

- **Resource:** returns one YouTube search query and a short description.
- **Collection:** returns a collection name and one to five video search queries.
- **Career:** returns a roadmap name and one to five ordered stages, each with one to two video search queries.

The route validates request size, mode, step, message roles, and the generated JSON shape. The reply step requests JSON output and rejects invalid or unexpected results.

The client then:

1. Sends a short conversation to `/api/chat`.
2. Sends each generated search query to `/api/find`.
3. Uses `/api/preview` to retrieve title, author/description, and thumbnail metadata.
4. Displays the result in the Roadmapper interface.
5. Uses `/api/resources` to persist an individually generated resource when the user selects **Save**.

The AI route does not generate video URLs or invent titles and channel names. URLs are resolved through the YouTube API.

## Deployment

Devory is a standard Next.js application and can be deployed to a Next.js-compatible host such as Vercel:

1. Import the repository into the hosting provider.
2. Set the production environment variables listed above.
3. Set `ROQQU_MODE=live` only when the production Roqqu credentials and payment setup are ready.
4. Configure the Supabase Auth site URL and redirect URLs for the deployed domain, including the email confirmation and `/auth/callback` flows.
5. Deploy with the configured build command:

   ```bash
   npm run build
   ```

6. Start the generated application with:

   ```bash
   npm start
   ```

`next.config.ts` allows optimized remote images from the project's Supabase Storage host. If the Supabase project changes, update the configured image remote pattern accordingly.

## Future Improvements

The current codebase identifies or leaves room for the following follow-up work:

- Persist AI-generated collections and career roadmaps instead of only displaying them in the chat flow.
- Complete and verify payment fulfillment/webhook processing. The tracked app includes wallet generation and a fulfillment helper, but no webhook route is present, and an older `PayButton` still references an unimplemented `/api/checkout` endpoint.
- Reconcile the `premium` access check with the `pro` value written by the fulfillment helper.
- Replace the placeholder premium price with the production price and complete production payment verification.

## Contributing

Contributions are welcome. Before opening a pull request:

1. Create a focused branch.
2. Install dependencies with `npm install`.
3. Run `npm run lint` and `npm run build`.
4. Describe the behavior change and any required environment or Supabase configuration.
5. Do not include `.env.local`, API keys, service-role credentials, or payment secrets.

## License

No license has been specified for this repository yet.