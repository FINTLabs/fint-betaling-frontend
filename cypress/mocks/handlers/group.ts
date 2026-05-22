import { http, HttpResponse } from "msw";
import { API_URL } from "../handlers";
import basisGroups from "../../fixtures/basis-groups.json";
import school from "../../fixtures/school.json";
import teachingGroups from "../../fixtures/teaching-groups.json";

export const groupHandlers = [
  http.get(`${API_URL}/api/group/basis-group`, () => {
    return HttpResponse.json(basisGroups);
  }),
  http.get(`${API_URL}/api/group/teaching-group`, () => {
    return HttpResponse.json(teachingGroups);
  }),
  http.get(`${API_URL}/api/group/school`, () => {
    return HttpResponse.json(school);
  }),
];
