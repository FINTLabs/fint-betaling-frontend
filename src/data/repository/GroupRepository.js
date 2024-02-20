// class GroupRepository {
//     static fetchAllCustomersFromSchool(schoolOrgId) {
//         const url = '/api/group/school';
//         const stopFetch = 15;
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             headers: new Headers({
//                 'x-school-org-id': schoolOrgId,
//             }),
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
//
//     static fetchAllBasisGroupsBySchool(schoolOrgId) {
//         const url = '/api/group/basis-group';
//         const stopFetch = 15;
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             headers: new Headers({
//                 'x-school-org-id': schoolOrgId,
//             }),
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
//
//     static fetchAllTeachingGroupBySchool(schoolOrgId) {
//         const url = '/api/group/teaching-group';
//         const stopFetch = 15;
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             headers: new Headers({
//                 'x-school-org-id': schoolOrgId,
//             }),
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
//
//     static fetchAllContactTeachingGroupBySchool(schoolOrgId) {
//         const url = '/api/group/contact-teacher-group';
//         const stopFetch = 15;
//         return fetch(url, {
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             headers: new Headers({
//                 'x-school-org-id': schoolOrgId,
//             }),
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
// }
//
// export default GroupRepository;
import axios from 'axios';

class GroupRepository {
    static fetchAllCustomersFromSchool(schoolOrgId) {
        const url = '/api/group/school';
        const stopFetch = 15;

        return axios.get(url, {
            headers: {
                'x-school-org-id': schoolOrgId,
            },
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }

    static fetchAllBasisGroupsBySchool(schoolOrgId) {
        const url = '/api/group/basis-group';
        const stopFetch = 15;

        return axios.get(url, {
            headers: {
                'x-school-org-id': schoolOrgId,
            },
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }

    static fetchAllTeachingGroupBySchool(schoolOrgId) {
        const url = '/api/group/teaching-group';
        const stopFetch = 15;

        return axios.get(url, {
            headers: {
                'x-school-org-id': schoolOrgId,
            },
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }

    static fetchAllContactTeachingGroupBySchool(schoolOrgId) {
        const url = '/api/group/contact-teacher-group';
        const stopFetch = 15;

        return axios.get(url, {
            headers: {
                'x-school-org-id': schoolOrgId,
            },
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }
}

export default GroupRepository;
