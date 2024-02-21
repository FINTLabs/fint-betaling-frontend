// import { FETCH_GROUPS, FETCH_GROUPS_FULFILLED, FETCH_GROUPS_REJECTED } from './actions';
// import GroupRepository from '../../repository/GroupRepository';
//
// export default function fetchGroup(schoolOrgId) {
//     return (dispatch) => {
//         dispatch({ type: FETCH_GROUPS });
//         const groups = [];
//         GroupRepository.fetchAllBasisGroupsBySchool(schoolOrgId)
//             .then(([result, json]) => {
//                 if (result.status === 200) {
//                     groups.push(...json);
//                 }
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: FETCH_GROUPS_REJECTED,
//                     payload: error,
//                 });
//             });
//         GroupRepository.fetchAllTeachingGroupBySchool(schoolOrgId)
//             .then(([result, json]) => {
//                 if (result.status === 200) {
//                     groups.push(...json);
//                 }
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: FETCH_GROUPS_REJECTED,
//                     payload: error,
//                 });
//             });
//
//         dispatch({
//             type: FETCH_GROUPS_FULFILLED,
//             payload: groups,
//         });
//     };
// }
import { FETCH_GROUPS, FETCH_GROUPS_FULFILLED, FETCH_GROUPS_REJECTED } from './actions';
import GroupRepository from '../../repository/GroupRepository';

export default function fetchGroup(schoolOrgId) {
    return (dispatch) => {
        dispatch({ type: FETCH_GROUPS });

        const basisGroupsPromise = GroupRepository.fetchAllBasisGroupsBySchool(schoolOrgId)
            .then((response) => {
                // Directly use the response if it's the expected data format
                if (Array.isArray(response) && response.length > 0) {
                    return response;
                }
                throw new Error('Failed to fetch basis groups');
            })
            .catch((error) => {
                // It's good practice to handle errors for each promise
                // eslint-disable-next-line no-console
                console.error('Error fetching basis groups:', error);
                return []; // Return an empty array to allow Promise.all to resolve
            });

        const teachingGroupsPromise = GroupRepository.fetchAllTeachingGroupBySchool(schoolOrgId)
            .then((response) => {
                // Assuming a similar response format as basis groups
                if (Array.isArray(response) && response.length > 0) {
                    return response;
                }
                throw new Error('Failed to fetch teaching groups');
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Error fetching teaching groups:', error);
                return [];
            });

        Promise.all([basisGroupsPromise, teachingGroupsPromise])
            .then(([basisGroups, teachingGroups]) => {
                const groups = [...basisGroups, ...teachingGroups];
                dispatch({
                    type: FETCH_GROUPS_FULFILLED,
                    payload: groups,
                });
            })
            .catch((error) => {
                // This catch will handle any errors thrown in the Promise.all
                dispatch({
                    type: FETCH_GROUPS_REJECTED,
                    payload: error,
                });
            });
    };
}
