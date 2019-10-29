class MvaRepository {
  static fetchMvaCodes() {
    const url = '/api/mvakode';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({'x-org-id': orgId})
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
}

export default MvaRepository;
