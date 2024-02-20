// class MvaCodeRepository {
//     static fetchMvaCodes() {
//         const url = '/api/mva-code';
//         const stopFetch = 15;
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             // headers: new Headers({'x-org-id': orgId})
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
// }
//
// export default MvaCodeRepository;
import axios from 'axios';

class MvaCodeRepository {
    static fetchMvaCodes() {
        const url = '/api/mva-code';
        const stopFetch = 15;

        return axios.get(url, {
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }
}

export default MvaCodeRepository;
