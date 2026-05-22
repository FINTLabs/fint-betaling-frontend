import { http, HttpResponse } from "msw";
import { API_URL } from "../handlers";

export const analyticsHandlers = [
  http.post(`${API_URL}/api/events`, () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
  // AnalyticsApi posts to the React Router proxy on the app origin, not the backend API.
  http.post("/_analytics/events", () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
