class OrderLineRepository {
  static fetchOrderLines() {
    const url = '/api/orderline';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({'x-org-id': orgId})
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
}

export default OrderLineRepository;
