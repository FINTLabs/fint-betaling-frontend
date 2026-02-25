import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";

export const register = new Registry();
collectDefaultMetrics({ register });

const LABELS = ["app", "route"] as const;

export const pageLoadsTotal = new Counter({
    name: "frontend_page_load_total",
    help: "Total number of page loads",
    labelNames: LABELS,
});
register.registerMetric(pageLoadsTotal);

export const pageLoadDurationSeconds = new Histogram({
    name: "frontend_page_load_duration_seconds",
    help: "Page load duration in seconds",
    labelNames: LABELS,
    buckets: [0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2, 3, 5, 8, 13],
});
register.registerMetric(pageLoadDurationSeconds);

export const frontendErrorsTotal = new Counter({
    name: "frontend_errors_total",
    help: "Total number of frontend errors",
    labelNames: [...LABELS, "error_type"] as const,
});
register.registerMetric(frontendErrorsTotal);

export async function metricsLoader() {
    return new Response(await register.metrics(), {
        headers: { "Content-Type": register.contentType },
    });
}