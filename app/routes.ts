import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("send", "routes/order-pending.tsx"),
  route("ny", "routes/order-new.tsx"),
  route("historikk", "routes/order-history.tsx"),
] satisfies RouteConfig;
