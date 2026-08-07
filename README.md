# SiteIQ

SiteIQ is a full-stack SaaS platform for website analysis and optimization. It combines an Express backend with a Next.js frontend to help users review SEO performance, Lighthouse scores, and technology recommendations for their websites.

## What the project does

- Analyze websites for SEO and performance insights
- Generate Lighthouse-based recommendations
- Provide AI-assisted tech stack and SEO guidance
- Support authentication, subscriptions, and user dashboards
- Expose REST APIs for frontend consumption and documentation

## Tech stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Stripe
- Frontend: Next.js, React, Tailwind CSS, shadcn/ui
- API docs: Swagger UI and Scalar API Reference

## Project structure

- backend/ - Express API server, routes, controllers, models, and services
- frontend/site-iq/ - Next.js client application
- backend/docs/ - API-related documentation and OpenAPI assets

## Prerequisites

- Node.js 20+ recommended
- npm or pnpm
- MongoDB instance
- API keys for OpenAI, Google PageSpeed, and Stripe

## Local setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd SiteIQ

cd backend
npm install

cd ../frontend/site-iq
npm install
```

### 2. Configure environment variables

Create a `.env` file in the backend folder with the variables below:

```env
PORT=4500
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_SECRET_KEY=your_jwt_secret_key
OPENAI_API_KEY=your_openai_key
OPENAI_BASE_URL=https://api.openai.com/v1
GOOGLE_PAGESPEED_API_KEY=your_pagespeed_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run the app

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend/site-iq
npm run dev
```

The backend will run on `http://localhost:4500` and the frontend on `http://localhost:3000`.

## API documentation

Once the backend is running, you can view the API docs at:

- http://localhost:4500/api-docs
- http://localhost:4500/reference

## Useful scripts

Backend:

- `npm run dev` - start the API server with nodemon
- `npm start` - start the API server

Frontend:

- `npm run dev` - start the Next.js dev server
- `npm run build` - build the production app
- `npm run lint` - run lint checks
- `npm run type-check` - run TypeScript checks

## Notes

This repository previously had several older migration and implementation notes. Those have been consolidated into this README so the project is easier to understand and maintain.
