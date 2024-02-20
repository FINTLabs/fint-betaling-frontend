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
            .then(([result, json]) => {
                if (result.status === 200) {
                    return json;
                }
                throw new Error('Failed to fetch basis groups');
            });

        const teachingGroupsPromise = GroupRepository.fetchAllTeachingGroupBySchool(schoolOrgId)
            .then(([result, json]) => {
                if (result.status === 200) {
                    return json;
                }
                throw new Error('Failed to fetch teaching groups');
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
                dispatch({
                    type: FETCH_GROUPS_REJECTED,
                    payload: error,
                });
            });
    };
}
