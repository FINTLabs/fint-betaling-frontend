import { http, HttpResponse } from "msw";
//TODO: !!! Fix handlers, separate into files and use fixtures
//TODO: mock data uses school id 313131313
// Use path-only matching so handlers work with any baseUrl
export const handlers = [
  http.get("*/api/me", () => {
    return HttpResponse.json({
      name: "Test User",
      employeeNumber: "12345",
      organisation: {
        organisationNumber: "123456789",
        name: "Test School",
      },
      organisationUnits: [
        {
          organisationNumber: "123456789",
          name: "Test School",
        },
      ],
      idleTime: 300000,
      admin: false,
    });
  }),

  http.get("*/api/claim", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const claims =
      status === "STORED"
        ? [
            {
              orgId: "fintlabs.no",
              orderNumber: 2001,
              claimStatus: "STORED",
              createdDate: "2025-02-20T10:00:00.000Z",
              lastModifiedDate: "2025-02-20T10:00:00.000Z",
              invoiceNumbersCommaSeperated: null,
              invoiceDate: null,
              paymentDueDate: null,
              amountDue: null,
              originalAmountDue: 35000,
              requestedNumberOfDaysToPaymentDeadline: null,
              customerId: "cust-2",
              customerName: "Test Student",
              createdByEmployeeNumber: "12345",
              organisationUnit: {
                organisationNumber: "123456789",
                name: "Test School",
              },
              principalCode: "PRINCIPAL1",
              principalUri: "/principal/1",
              invoiceUri: null,
              orderItems: [],
              statusMessage: "",
              timestamp: 1708430400000,
              invoiceNumbers: [],
            },
          ]
        : [
            {
              orgId: "fintlabs.no",
              orderNumber: 1001,
              claimStatus: "SENT",
              createdDate: "2025-02-20T10:00:00.000Z",
              lastModifiedDate: "2025-02-20T10:00:00.000Z",
              invoiceNumbersCommaSeperated: null,
              invoiceDate: null,
              paymentDueDate: null,
              amountDue: null,
              originalAmountDue: 50000,
              requestedNumberOfDaysToPaymentDeadline: null,
              customerId: "cust-1",
              customerName: "Test Customer",
              createdByEmployeeNumber: "12345",
              organisationUnit: {
                organisationNumber: "123456789",
                name: "Test School",
              },
              principalCode: "PRINCIPAL1",
              principalUri: "/principal/1",
              invoiceUri: null,
              orderItems: [],
              statusMessage: "",
              timestamp: 1708430400000,
              invoiceNumbers: [],
            },
          ];
    return HttpResponse.json(claims);
  }),

  http.get("*/api/group/basis-group", () => {
    return HttpResponse.json([
      {
        name: "1A",
        description: "Basis group 1A",
        customers: [
          { id: "student-1", name: "Student One" },
          { id: "student-2", name: "Student Two" },
        ],
      },
    ]);
  }),

  http.get("*/api/group/teaching-group", () => {
    return HttpResponse.json([
      {
        name: "Math 101",
        description: "Mathematics class",
        customers: [{ id: "student-3", name: "Student Three" }],
      },
    ]);
  }),

  http.get("*/api/group/school", () => {
    return HttpResponse.json({
      name: "Test School",
      description: "Test School",
      customers: [{ id: "cust-1", name: "Test Customer" }],
    });
  }),

  http.get("*/api/principal", () => {
    return HttpResponse.json({
      code: "PRINCIPAL1",
      description: "Test Principal",
      lineitems: [
        {
          itemCode: "ITEM001",
          itemPrice: 64900,
          taxrate: 25,
          description: "Test product",
          uri: "/product/1",
        },
      ],
      uri: "/principal/1",
      organisation: {
        organisationNumber: "123456789",
        name: "Test School",
      },
    });
  }),

  http.post("*/api/claim", () => {
    return HttpResponse.json([
      { orderNumber: 3001, claimStatus: "STORED" },
    ]);
  }),

  http.post("*/api/claim/send", () => {
    return HttpResponse.json([
      { orderNumber: 2001, claimStatus: "SENT" },
    ]);
  }),

  http.delete("*/api/claim/order-number/*", () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),

  http.get("*/api/claim/count/by-status/STORED*", () => {
    return HttpResponse.json(5);
  }),

  http.get("*/api/claim/count/by-status/SEND_ERROR*", () => {
    return HttpResponse.json(1);
  }),

  http.get("*/api/claim/count/by-status/ACCEPT_ERROR*", () => {
    return HttpResponse.json(0);
  }),

  http.get("*/api/claim/count/by-status/UPDATE_ERROR*", () => {
    return HttpResponse.json(0);
  }),

  http.get("*/api/claim/count/by-status/ERROR*", () => {
    return HttpResponse.json(1);
  }),

  http.post("*/api/events", () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
