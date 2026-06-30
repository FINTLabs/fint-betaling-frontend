import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("send", "routes/claim-pending.tsx"),
  route("ny", "routes/claim-new.tsx"),
  route("historikk", "routes/claim-history.tsx"),
  route("_analytics/events", "routes/api.events.tsx"),
] satisfies RouteConfig;
