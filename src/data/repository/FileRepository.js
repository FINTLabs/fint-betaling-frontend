// class FileRepository {
//     static sendFile(schoolOrgId, file) {
//         const url = '/api/file';
//         const stopFetch = 15;
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'POST',
//             headers: new Headers({
//                 'x-school-org-id': schoolOrgId,
//             }),
//             body: file,
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
// }
//
// export default FileRepository;
import axios from 'axios';

class FileRepository {
    static sendFile(schoolOrgId, file) {
        const url = '/api/file';
        const stopFetch = 15;

        const formData = new FormData();
        formData.append('file', file);

        return axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-school-org-id': schoolOrgId,
            },
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }
}

export default FileRepository;
