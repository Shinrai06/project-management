## Running Prometheus with Docker (Windows - Git Bash)

To start Prometheus using Docker with your local `prometheus.yml` config file, run the following command:

```bash
docker run -d -p 9090:9090 \
  -v "<repo_path>/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml" \
  --name prometheus \
  prom/prometheus
```

- You can now access Prometheus UI at: http://localhost:9090

**Note:**

- Without the /metrics route, Prometheus can't scrape your application — so your dashboards would be empty.
- Use forward slashes `/` in the volume path on Git Bash to avoid issues.
- Adjust `"<repo_path>"` to where the repo is added in the system.

## Backend container CI workflow

- `.github/workflows/container.yml` runs on `push` to `main` or manual `workflow_dispatch`.
- It builds the backend Docker image from `backend/Dockerfile` via Buildx but does not publish it.
- After the workflow runs you can download the job’s artifacts or rerun `docker build` locally using the same context to produce a runnable image.
- Update `IMAGE_NAME` in the workflow if you want the built image tagged differently for local testing.
- Runtime configuration: pass the same environment variables you normally place in `.env` via `docker run -e ...` or a compose file. The container listens on port `3000` by default.
