class MvaApi {
    static fetchMvaCodes(orgId) {
        const url = '/repository/mvakode';
        return fetch(url, {
            method: "GET",
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }
}

export default MvaApi