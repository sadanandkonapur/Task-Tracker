Deployment guide

Backend (Render or similar)
- Create a new Web Service on Render.
- Connect your GitHub repo `sadanandkonapur/Task-Tracker`.
- Build command: `npm install`
- Start command: `npm start` (or `node server.js`)
- Set environment variables:
  - `MONGODB_URI` (pointing to MongoDB Atlas or managed DB)
  - `PORT` (optional)

Frontend (Vercel)
- Import project on Vercel and select the `frontend` folder as the project root.
- Framework preset: `Other` or `Vite`.
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).

Docker deploy (optional)
- Build and push images to Docker Hub or a container registry, then deploy to services like Render, Fly.io, or AWS.

CI/CD notes
- You can use GitHub Actions to automatically build and deploy. Both Vercel and Render integrate directly with GitHub for automatic deploys on push.

If you want, I can create GitHub Actions workflows or attempt to deploy to a selected provider if you provide credentials/access tokens. Otherwise, follow the steps above to finish deployment through the provider UI.
