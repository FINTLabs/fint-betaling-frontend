class CustomerRepository {
  static fetchCustomers(orgId, schoolOrgId) {
    const url = '/api/customer';
    const stopFetch = 15;

    return fetch(url, {
      retryOn(attempt, error, response) {
        return (error !== null || response.status >= 400) && attempt <= stopFetch;
      },
      method: 'GET',
      headers: new Headers({
        ORG_ID: orgId,
        SCHOOL_ORG_ID: schoolOrgId,
      }),
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
}

export default CustomerRepository;
