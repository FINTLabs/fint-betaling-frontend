class GroupRepository {

    static fetchAllCustomersFromSchool(orgId, schoolOrgId) {
        const url = '/api/group/school';
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
                //'ORG_ID': orgId,
                'SCHOOL_ORG_ID': schoolOrgId
            })
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }

    static fetchAllBasisGroupsFromSchool(orgId, schoolOrgId) {
        const url = '/api/group/basis-group';
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
                //'ORG_ID': orgId,
                'SCHOOL_ORG_ID': schoolOrgId
            })
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }

    static fetchAllCustomerGroupsFromTeachingGroupAndSchool() {
        const url = '/api/group/teaching-group';
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
            // headers: new Headers({ 'x-org-id': orgId })
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }

    static fetchAllCustomerFromContactTeachingGroupAndSchool() {
        const url = '/api/group/contact-teacher-group';
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
            // headers: new Headers({ 'x-org-id': orgId })
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }
}

export default GroupRepository;
