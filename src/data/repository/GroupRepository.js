class GroupRepository {
    static fetchAllCustomerGroups() {
        const url = '/api/group/basisgruppe';
        return fetch(url, {
            method: "GET",
            //headers: new Headers({ 'x-org-id': orgId })
        }).then(result => Promise.all([result, result.json()]))
            .catch(error => error);
    }
/*
    static fetchCustomerGroupsFromBasisgruppe() {
        const url = '/api/group/basisgruppe';
        return fetch(url, {
            method: "GET",
            //headers: new Headers({ 'x-org-id': orgId })
        }).then(result => Promise.all([result, result.json()]))
            .catch(error => error);
    }

    static fetchCustomerGroupsFromKontaktlarergruppe() {
        const url = '/api/group/kontaktlarergruppe';
        return fetch(url, {
            method: "GET",
            //headers: new Headers({ 'x-org-id': orgId })
        }).then(result => Promise.all([result, result.json()]))
            .catch(error => error);
    }

    static fetchCustomerGroupsFromUndervisningsgruppe() {
        const url = '/api/group/undervisningsgruppe';
        return fetch(url, {
            method: "GET",
            //headers: new Headers({ 'x-org-id': orgId })
        }).then(result => Promise.all([result, result.json()]))
            .catch(error => error);
    }*/
}

export default GroupRepository