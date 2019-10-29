class InvoiceRepository {
  static sendOrders(orgId, orderList) {
    const request = new Request('/api/invoice/send',
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'x-org-id': orgId,
        }),
        body: JSON.stringify(
          orderList,
        ),
      });

    return fetch(request)
      .then((response) => response.json())
      .catch((error) => error);
  }
}

export default InvoiceRepository;
