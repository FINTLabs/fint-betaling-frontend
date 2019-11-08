class GroupRepository {
  static fetchAllCustomerGroupsFromSchool() {
    const url = '/api/group/school';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({ 'x-org-id': orgId })
    })
      .then((result) => Promise.all([result, result.json()]))
      .catch((error) => error);
  }
  static fetchAllCustomerGroupsFromBasisGroupAndSchool() {
    const url = '/api/group/basis-group';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({ 'x-org-id': orgId })
    })
        .then((result) => Promise.all([result, result.json()]))
        .catch((error) => error);
  }
  static fetchAllCustomerGroupsFromTeachingGroupAndSchool() {
    const url = '/api/group/teaching-group';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({ 'x-org-id': orgId })
    })
        .then((result) => Promise.all([result, result.json()]))
        .catch((error) => error);
  }
  static fetchAllCustomerFromContactTeachingGroupAndSchool() {
    const url = '/api/group/contact-teacher-group';
    return fetch(url, {
      method: 'GET',
      // headers: new Headers({ 'x-org-id': orgId })
    })
        .then((result) => Promise.all([result, result.json()]))
        .catch((error) => error);
  }
}

export default GroupRepository;
