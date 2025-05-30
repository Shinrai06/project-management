import client from "prom-client";

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable default metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics({ register });

// Custom metric (e.g., HTTP request duration)
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(httpRequestDuration);

export { register, httpRequestDuration };
