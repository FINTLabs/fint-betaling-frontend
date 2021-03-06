class MvaCodeRepository {
    static fetchMvaCodes() {
        const url = '/api/mva-code';
        const stopFetch = 15;
        return fetch(url, {
            retryOn(attempt, error, response) {
                return (error !== null || response.status >= 400) && attempt <= stopFetch;
            },
            method: 'GET',
            // headers: new Headers({'x-org-id': orgId})
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }
}

export default MvaCodeRepository;
