class CustomerRepository {
    static fetchCustomers(orgId, schoolOrgId) {
        const url = '/api/customer';

        return fetch(url, {
            method: 'GET',
            headers: new Headers({
                'ORG_ID': orgId,
                'SCHOOL_ORG_ID': schoolOrgId
            })
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }
}

export default CustomerRepository;
