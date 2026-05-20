import { http, HttpResponse } from "msw";
import me from "../../fixtures/me.json";
import { API_URL } from "../handlers";

export const meHandlers = [
  http.get(`${API_URL}/api/me`, () => {
    return HttpResponse.json(me);
  }),
];
