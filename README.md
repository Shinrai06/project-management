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
