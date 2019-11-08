class LineItemRepository {
  static fetchOrderLines() {
    const url = '/api/lineitem';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({'x-org-id': orgId})
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
}

export default LineItemRepository;
