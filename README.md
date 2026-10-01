# ChatApp

ChatApp is a full-stack real-time messaging application for private conversations, media sharing, and personalized chat spaces.

## Features

- Clerk-powered authentication
- Real-time messaging with Socket.IO
- MongoDB persistence through Mongoose
- Image and video uploads through ImageKit
- Responsive desktop and mobile chat layouts
- Theme presets, dark mode, and conversation wallpapers
- Docker support for a single production image

## Project structure

```text
frontend/   React + Vite client
backend/    Express + Socket.IO API
Dockerfile  Multi-stage production image
```

## Development

Install dependencies in each application:

```bash
cd frontend
npm install
npm run dev
```

In a second terminal:

```bash
cd backend
npm install
npm run dev
```

Configure the required environment variables in the backend and expose the Clerk publishable key to the frontend:

- `PORT`
- `FRONTEND_URL` (defaults to `http://localhost:5173`)
- `MONGODB_URI`
- Clerk credentials
- ImageKit credentials for media uploads
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` (optional; leave empty when frontend and API share a host)
- `VITE_DEV_API_URL` (optional local Vite proxy target; defaults to `http://localhost:3000`)

## Validation

```bash
cd frontend
npm run lint
npm run build

cd ../backend
npm run build
```

## Docker

From the repository root:

```bash
docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=your_key -t chatapp .
docker run --env-file backend/.env -p 3001:3001 chatapp
```

The production server serves the built frontend and backend API together.
