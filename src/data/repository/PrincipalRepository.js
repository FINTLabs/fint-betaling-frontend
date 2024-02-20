// class PrincipalRepository {
//     static fetchPrincipals(orgId) {
//         const url = '/api/principal';
//         const stopFetch = 15;
//
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             headers: new Headers({ 'x-school-org-id': orgId }),
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
// }
//
// export default PrincipalRepository;
import axios from 'axios';

class PrincipalRepository {
    static fetchPrincipals(orgId) {
        const url = '/api/principal';
        const stopFetch = 15;

        return axios.get(url, {
            headers: {
                'x-school-org-id': orgId,
            },
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }
}

export default PrincipalRepository;
