# Task Tracker MERN Application

This project is a full-stack task tracker built with React, Express, Node.js, and MongoDB.

## Features
- Create, view, update, and delete tasks
- Form validation for task title
- REST APIs for CRUD operations
- MongoDB integration with in-memory fallback
- Responsive UI with dynamic updates

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000 and the backend on http://localhost:5000.

## Deployment notes
- The backend can be deployed to Render, Railway, or similar Node hosting services.
- The frontend can be deployed to Vercel or Netlify.

## Publish to GitHub & Deploy

1) Initialize, commit and push (run locally):

```bash
git init
git add .
git commit -m "Initial commit: MERN Task Tracker"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2) Deploy backend (Render example):

- Create a new Web Service on Render, connect your GitHub repo and set the build command `npm install` and start command `node server.js`.
- Add an environment variable `MONGODB_URI` with your MongoDB connection string.

3) Deploy frontend (Vercel example):

- Import the frontend project into Vercel (select `frontend` directory), set build command `npm run build` and output directory `dist`.
- Optionally set `VITE_API_URL` environment variable to your deployed backend URL so the frontend can call the API.

If you want, I can initialize the git repo here and create the first commit for you. To push to GitHub you'll need to add the remote or provide a repo URL.
