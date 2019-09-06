class EmployerApi {
    static fetchEmployers(orgId) {
        const url = '/repository/oppdragsgiver';
        return fetch(url, {
            method: "GET",
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }
}

export default EmployerApi