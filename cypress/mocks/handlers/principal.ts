import { http, HttpResponse } from "msw";
import { API_URL } from "../handlers";
import principals from "../../fixtures/principals.json";

export const principalHandlers = [
  http.get(`${API_URL}/api/principal`, () => {
    return HttpResponse.json(principals);
  }),
];
