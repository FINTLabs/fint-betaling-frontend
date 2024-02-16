class MeRepository {
    static fetchMe() {
        const url = 'api/me';
        const stopFetch = 15;
        return fetch(url, {
            retryOn(attempt, error, response) {
                return (error !== null || response.status >= 400) && attempt <= stopFetch;
            },
            method: 'GET',
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }
}

export default MeRepository;
