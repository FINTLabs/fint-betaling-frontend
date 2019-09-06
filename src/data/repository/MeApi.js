class MeApi {
    static fetchMe(orgId) {
        const url = '/repository/me';
        return fetch(url, {
            method: "GET",
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }
}

export default MeApi