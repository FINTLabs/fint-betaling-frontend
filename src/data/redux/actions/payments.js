// import { FETCH_PAYMENTS, FETCH_PAYMENTS_FULFILLED, FETCH_PAYMENTS_REJECTED } from './actions';
// import ClaimRepository from '../../repository/ClaimRepository';
//
// export default function fetchPayments(periodSelection, orgIdSelection, status) {
//     return (dispatch) => {
//         dispatch({ type: FETCH_PAYMENTS });
//
//         ClaimRepository.fetchPayments(periodSelection, orgIdSelection, status)
//             .then(([result, json]) => {
//                 if (result.status === 200) {
//                     dispatch({
//                         type: FETCH_PAYMENTS_FULFILLED,
//                         payload: json,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: FETCH_PAYMENTS_REJECTED,
//                     payload: error,
//                 });
//             });
//     };
// }
import axios from 'axios';
import { FETCH_PAYMENTS, FETCH_PAYMENTS_FULFILLED, FETCH_PAYMENTS_REJECTED } from './actions';

export default function fetchPayments(periodSelection, orgIdSelection, status) {
    return (dispatch) => {
        dispatch({ type: FETCH_PAYMENTS });

        axios.get('/api/claim', {
            params: {
                periodSelection,
                schoolSelection: orgIdSelection,
                status,
            },
        })
            .then((response) => {
                dispatch({
                    type: FETCH_PAYMENTS_FULFILLED,
                    payload: response.data,
                });
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    dispatch({
                        type: FETCH_PAYMENTS_REJECTED,
                        payload: {
                            status: error.response.status,
                            message: error.response.data,
                        },
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    dispatch({
                        type: FETCH_PAYMENTS_REJECTED,
                        payload: {
                            status: 'NoResponse',
                            message: 'No response received from the server.',
                        },
                    });
                } else {
                    // Something happened in setting up the request that triggered an error
                    dispatch({
                        type: FETCH_PAYMENTS_REJECTED,
                        payload: {
                            status: 'RequestError',
                            message: 'An error occurred while making the request.',
                        },
                    });
                }
            });
    };
}
