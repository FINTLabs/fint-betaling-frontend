class GroupApi {
    static fetchAllCustomerGroups(orgId) {
        const url = '/repository/group';
        return fetch(url, {
            method: "GET",
            headers: new Headers({ 'x-org-id': orgId })
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }

    static fetchCustomerGroupsFromBasisgruppe(orgId) {
        const url = '/repository/group/basisgruppe';
        return fetch(url, {
            method: "GET",
            headers: new Headers({ 'x-org-id': orgId })
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }

    static fetchCustomerGroupsFromKontaktlarergruppe(orgId) {
        const url = '/repository/group/kontaktlarergruppe';
        return fetch(url, {
            method: "GET",
            headers: new Headers({ 'x-org-id': orgId })
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }

    static fetchCustomerGroupsFromUndervisningsgruppe(orgId) {
        const url = '/repository/group/undervisningsgruppe';
        return fetch(url, {
            method: "GET",
            headers: new Headers({ 'x-org-id': orgId })
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }
}

export default GroupApi