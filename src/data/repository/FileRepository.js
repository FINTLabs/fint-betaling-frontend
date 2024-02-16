class FileRepository {
    static sendFile(schoolOrgId, file) {
        const url = 'api/file';
        const stopFetch = 15;
        return fetch(url, {
            retryOn(attempt, error, response) {
                return (error !== null || response.status >= 400) && attempt <= stopFetch;
            },
            method: 'POST',
            headers: new Headers({
                'x-school-org-id': schoolOrgId,
            }),
            body: file,
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }
}

export default FileRepository;
