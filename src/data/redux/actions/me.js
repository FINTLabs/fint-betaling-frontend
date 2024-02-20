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
import { FETCH_ME, FETCH_ME_FULFILLED, FETCH_ME_REJECTED } from './actions';
import MeRepository from '../../repository/MeRepository';

export default function fetchMe() {
    return (dispatch) => {
        dispatch({ type: FETCH_ME });

        MeRepository.fetchMe()
            .then((data) => {
                dispatch({
                    type: FETCH_ME_FULFILLED,
                    payload: data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_ME_REJECTED,
                    payload: error,
                });
            });
    };
}
