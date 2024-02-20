// import { FETCH_ME, FETCH_ME_FULFILLED, FETCH_ME_REJECTED } from './actions';
// import MeRepository from '../../repository/MeRepository';
//
// export default function fetchMe() {
//     return (dispatch) => {
//         dispatch({ type: FETCH_ME });
//
//         MeRepository.fetchMe()
//             .then(([result, json]) => {
//                 if (result.status === 200) {
//                     dispatch({
//                         type: FETCH_ME_FULFILLED,
//                         payload: json,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: FETCH_ME_REJECTED,
//                     payload: error,
//                 });
//             });
//     };
// }
import axios from 'axios';
import { FETCH_ME, FETCH_ME_FULFILLED, FETCH_ME_REJECTED } from './actions';

// Assuming MeRepository is updated to use Axios
class MeRepository {
    static fetchMe() {
        return axios.get('/api/me');
    }
}

export default function fetchMe() {
    return (dispatch) => {
        dispatch({ type: FETCH_ME });

        MeRepository.fetchMe()
            .then((response) => {
                // With Axios, the HTTP status and JSON data are accessed directly from the response object
                if (response.status === 200) {
                    dispatch({
                        type: FETCH_ME_FULFILLED,
                        payload: response.data, // Directly use `response.data` here
                    });
                }
            })
            .catch((error) => {
                // Axios encapsulates errors differently; use `error.response` for HTTP errors
                // Check if error.response exists; otherwise, use the error directly
                const errorPayload = error.response ? error.response.data : error;
                dispatch({
                    type: FETCH_ME_REJECTED,
                    payload: errorPayload,
                });
            });
    };
}
