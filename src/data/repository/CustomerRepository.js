class CustomerRepository {
    static fetchCustomers(orgId, schoolOrgId) {
        const url = '/api/customer';
        const fetch = require('fetch-retry');
        const stopFetch = 15;

        return fetch(url, {
            retryOn: function(attempt, error, response) {
                // retry on any network error, or 4xx or 5xx status codes
                if ((error !== null || response.status >= 400) && attempt<=stopFetch) {
                    console.log(`retrying, attempt number ${attempt + 1}`);
                    return true;}
            },
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
