class GroupRepository {
  static fetchAllCustomersFromSchool(orgId, schoolOrgId) {
    const url = '/api/group/school';
    const stopFetch = 15;
    return fetch(url, {
      retryOn(attempt, error, response) {
        return (error !== null || response.status >= 400) && attempt <= stopFetch;
      },
      method: 'GET',
      headers: new Headers({
        // 'ORG_ID': orgId,
        SCHOOL_ORG_ID: schoolOrgId,
      }),
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }

  static fetchAllBasisGroupsFromSchool(orgId, schoolOrgId) {
    const url = '/api/group/basis-group';
    const stopFetch = 15;
    return fetch(url, {
      retryOn(attempt, error, response) {
        return (error !== null || response.status >= 400) && attempt <= stopFetch;
      },
      method: 'GET',
      headers: new Headers({
        // 'ORG_ID': orgId,
        SCHOOL_ORG_ID: schoolOrgId,
      }),
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }

  static fetchAllCustomerGroupsFromTeachingGroupAndSchool() {
    const url = '/api/group/teaching-group';
    const stopFetch = 15;
    return fetch(url, {
      retryOn(attempt, error, response) {
        return (error !== null || response.status >= 400) && attempt <= stopFetch;
      },
      method: 'GET',
      // headers: new Headers({ 'x-org-id': orgId })
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }

  static fetchAllCustomerFromContactTeachingGroupAndSchool() {
    const url = '/api/group/contact-teacher-group';
    const stopFetch = 15;
    return fetch(url, {
      retryOn(attempt, error, response) {
        return (error !== null || response.status >= 400) && attempt <= stopFetch;
      },
      method: 'GET',
      // headers: new Headers({ 'x-org-id': orgId })
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
}

export default GroupRepository;
