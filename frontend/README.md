# ChatApp

ChatApp is a full-stack real-time messaging workspace with private conversations, media sharing, customizable themes, and responsive desktop/mobile layouts.

## Stack

- React, Vite, Tailwind CSS, and HeroUI
- Express and Socket.IO
- MongoDB with Mongoose
- Clerk authentication
- ImageKit media uploads

## Local development

Install dependencies in both applications:

```bash
cd frontend
npm install
npm run dev

cd ../backend
npm install
npm run dev
```

Configure the required environment variables before starting the backend:

- `PORT`
- `FRONTEND_URL`
- `MONGODB_URI`
- Clerk server credentials
- ImageKit credentials when media uploads are enabled
- `VITE_CLERK_PUBLISHABLE_KEY` for the frontend

The frontend uses the backend API and Socket.IO service through the configured development proxy.

## Validation

```bash
cd frontend
npm run lint
npm run build

cd ../backend
npm run build
```

## Docker

From the repository root, build and run the production image:

```bash
docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=your_key -t chatapp .
docker run --env-file backend/.env -p 3001:3001 chatapp
```

The Express server serves the built frontend and API from the same application.
