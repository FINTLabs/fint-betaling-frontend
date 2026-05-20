import { http, HttpResponse } from "msw";
import { API_URL } from "../handlers";

export const analyticsHandlers = [
  http.post(`${API_URL}/api/events`, () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
  http.post(`${API_URL}/_analytics/events`, () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
