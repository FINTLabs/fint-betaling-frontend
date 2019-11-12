import {FETCH_MVA, FETCH_MVA_FULFILLED, FETCH_MVA_REJECTED} from './actions';
import MvaCodeRepository from '../../repository/MvaCodeRepository';


export default function fetchMva() {
    return (dispatch) => {
        dispatch({type: FETCH_MVA});


        MvaCodeRepository.fetchMvaCodes()
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_MVA_FULFILLED,
                        payload: json,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_MVA_REJECTED,
                    payload: error,
                });
            });
    };
}
