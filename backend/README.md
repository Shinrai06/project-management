# Backend Service (Development)

This service is meant to run locally in development. Environment variables are defined in `backend/.env.example`.

## Configure environment variables

1. Copy the template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Fill in the placeholders (MongoDB URI, session secret, Google OAuth credentials, frontend origin).

### MongoDB options

- **Default (MongoDB Atlas)**: `MONGO_URI` already points to an Atlas URI. Replace `<username>`, `<password>`, and the cluster host with your values.
- **Fallback (local Docker)**: If you do not have Atlas, run a local Mongo container and switch `MONGO_URI` to `mongodb://localhost:27017/teamsync_db`.

Start a local MongoDB container:

```bash
docker run -d --name proj-mgmt-mongo -p 27017:27017 -v proj-mgmt-mongo-data:/data/db mongo:6
```

## Install & run

```bash
cd backend
npm install
npm run dev
```

The server listens on `PORT` (default `8000`) and exposes APIs under `/api`.

## Run with Docker Compose

1. Create your env file if you have not already:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. If you want to use the local MongoDB container defined in the compose file, update `.env` so `MONGO_URI=mongodb://mongo:27017/teamsync_db`.
3. Start the stack (from `backend/`):
   ```bash
   docker compose up --build -d
   ```
4. Visit the API at http://localhost:8000.
5. Tail logs (optional):
   ```bash
   docker compose logs -f backend
   ```
6. Stop everything when done:
   ```bash
   docker compose down
   ```

If you keep `MONGO_URI` pointed at MongoDB Atlas, the `backend` service will skip the local `mongo` container—feel free to remove or comment out the `mongo` service in `docker-compose.yml` if it is not needed.
