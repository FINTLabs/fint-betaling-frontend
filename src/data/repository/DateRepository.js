class DateRepository {

    static fetchDates() {
        const url = '/api/dato';

        return fetch(url, {
            method: "GET",
            //headers: new Headers({'x-org-id': orgId})
        })
            .then(result => Promise.all([result, result.json()]))
            .catch(error => error);
    }
}

export default DateRepository