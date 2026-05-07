# Hacker News Story Board

A mini full-stack MERN application that scrapes the top 10 stories from Hacker News, stores them in MongoDB, and lets authenticated users bookmark stories.

## Features

- Scrapes the top 10 stories from `https://news.ycombinator.com`
- Stores `title`, `url`, `points`, `author`, and `postedAt` in MongoDB
- Runs the scraper automatically on server start
- Exposes manual scrape trigger with `POST /api/scrape`
- JWT authentication with register and login APIs
- Story listing, single story fetch, and bookmark toggle APIs
- React frontend with:
  - Login and register pages
  - Story feed
  - Protected bookmarks page
  - React Context based authentication state
- Pagination support on `GET /api/stories?page=1&limit=10`

## Tech Stack

- MongoDB
- Express
- React
- Node.js
- Mongoose
- JWT
- Vite

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
```

## Environment Variables

### Backend

Copy [backend/.env.example](/C:/Users/palak/dacby-assignment/backend/.env.example) to `backend/.env`.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hn-stories
JWT_SECRET=change-this-secret
CLIENT_URL=http://localhost:5173
```

### Frontend

Copy [frontend/.env.example](/C:/Users/palak/dacby-assignment/frontend/.env.example) to `frontend/.env`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## How To Run Locally

### 1. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Start MongoDB

Make sure a local MongoDB instance is running on the URI you configured.

### 3. Run the backend

```bash
cd backend
npm run dev
```

The backend starts on `http://localhost:5000` and automatically runs the scraper during startup.

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

The frontend starts on `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Scraper

- `POST /api/scrape`

### Stories

- `GET /api/stories`
- `GET /api/stories?page=1&limit=10`
- `GET /api/stories?bookmarked=true`
- `GET /api/stories/:id`
- `POST /api/stories/:id/bookmark`

## Notes

- Bookmarks are tied to the authenticated user.
- `postedAt` is derived from the relative Hacker News age text at scrape time.
- Stories are sorted by points in descending order.

## Suggested Submission Checklist

- Push the full repository with commit history
- Record a 5 to 10 minute Loom walkthrough
- Mention setup steps and environment variables in the submission
