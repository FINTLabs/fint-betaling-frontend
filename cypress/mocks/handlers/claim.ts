import { http, HttpResponse } from "msw";
import { API_URL } from "../handlers";
import claims from "../../fixtures/claims.json";
import claimsStored from "../../fixtures/claims-stored.json";
import countAcceptError from "../../fixtures/count-accept-error.json";
import countError from "../../fixtures/count-error.json";
import countSendError from "../../fixtures/count-send-error.json";
import countStored from "../../fixtures/count-stored.json";
import countUpdateError from "../../fixtures/count-update-error.json";

const countByStatus: Record<string, number> = {
  STORED: countStored,
  SEND_ERROR: countSendError,
  ACCEPT_ERROR: countAcceptError,
  UPDATE_ERROR: countUpdateError,
  ERROR: countError,
};

export const claimHandlers = [
  http.get(`${API_URL}/api/claim`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    return HttpResponse.json(status === "STORED" ? claimsStored : claims);
  }),

  http.post(`${API_URL}/api/claim`, () => {
    return HttpResponse.json([{ orderNumber: 3001, claimStatus: "STORED" }]);
  }),

  http.post(`${API_URL}/api/claim/send`, () => {
    return HttpResponse.json([{ orderNumber: 2001, claimStatus: "SENT" }]);
  }),

  http.delete(`${API_URL}/api/claim/order-number/:orderNumber`, ({ params }) => {
    return HttpResponse.json({
      orderNumber: params.orderNumber,
      claimStatus: "CANCELLED",
    });
  }),

  http.get(`${API_URL}/api/claim/count/by-status/:status`, ({ params }) => {
    const status = String(params.status ?? "");
    return HttpResponse.json(countByStatus[status] ?? 0);
  }),
];
