// import { FETCH_PRINCIPALS, FETCH_PRINCIPALS_FULFILLED, FETCH_PRINCIPALS_REJECTED } from './actions';
// import PrincipalRepository from '../../repository/PrincipalRepository';
//
// export default function fetchPrincipal(orgId) {
//     return (dispatch) => {
//         dispatch({ type: FETCH_PRINCIPALS });
//
//         PrincipalRepository.fetchPrincipals(orgId)
//             .then(([result, json]) => {
//                 if (result.status === 200) {
//                     dispatch({
//                         type: FETCH_PRINCIPALS_FULFILLED,
//                         payload: json,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: FETCH_PRINCIPALS_REJECTED,
//                     payload: error,
//                 });
//             });
//     };
// }
import { FETCH_PRINCIPALS, FETCH_PRINCIPALS_FULFILLED, FETCH_PRINCIPALS_REJECTED } from './actions';
import PrincipalRepository from '../../repository/PrincipalRepository';

export default function fetchPrincipal(orgId) {
    return (dispatch) => {
        dispatch({ type: FETCH_PRINCIPALS });

        PrincipalRepository.fetchPrincipals(orgId)
            .then((data) => {
                // Assuming data is directly returned without a response wrapper
                dispatch({
                    type: FETCH_PRINCIPALS_FULFILLED,
                    payload: data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_PRINCIPALS_REJECTED,
                    payload: error,
                });
            });
    };
}
