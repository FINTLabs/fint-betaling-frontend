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
import axios from 'axios';
import { FETCH_PRINCIPALS, FETCH_PRINCIPALS_FULFILLED, FETCH_PRINCIPALS_REJECTED } from './actions';

export default function fetchPrincipal(orgId) {
    return (dispatch) => {
        dispatch({ type: FETCH_PRINCIPALS });

        axios.get('/api/principal', {
            headers: {
                'x-school-org-id': orgId,
            },
        })
            .then((response) => {
                dispatch({
                    type: FETCH_PRINCIPALS_FULFILLED,
                    payload: response.data,
                });
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    dispatch({
                        type: FETCH_PRINCIPALS_REJECTED,
                        payload: {
                            status: error.response.status,
                            message: error.response.data,
                        },
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    dispatch({
                        type: FETCH_PRINCIPALS_REJECTED,
                        payload: {
                            status: 'NoResponse',
                            message: 'No response received from the server.',
                        },
                    });
                } else {
                    // Something happened in setting up the request that triggered an error
                    dispatch({
                        type: FETCH_PRINCIPALS_REJECTED,
                        payload: {
                            status: 'RequestError',
                            message: 'An error occurred while making the request.',
                        },
                    });
                }
            });
    };
}
