# Portfolio

Welcome to my portfolio! I'm a passionate Full Stack Web Developer focused on building modern, scalable, and user-friendly web applications.

## Deployment

This repository is now configured for Render deployment.

### Frontend
- Build command: `cd client && npm install && npm run build`
- Publish directory: `client/dist`
- Set `VITE_API_URL` to your backend service URL in Render so the frontend can call the backend.

### Backend
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Service type: Node web service
- Required environment variables: `EMAIL_USER`, `EMAIL_PASS`, `MONGODB_URI`, and optionally `CLIENT_URL`
- The backend uses `PORT` from the environment, set in `render.yaml` to `3001`.
- A Render-ready health endpoint is available at `/health`.
- Use `.env.example` locally to see supported variables and port defaults.

### Notes
- `render.yaml` defines both the frontend static site and backend service.
- The client uses `VITE_API_URL` in production and falls back to same-origin locally.
