class DateApi {
    static fetchDates(orgId) {
        const url = '/repository/dato';
        return fetch(url, {
            method: "GET",
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }
}

export default DateApi