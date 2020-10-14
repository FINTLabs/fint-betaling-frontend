import {FETCH_ME, FETCH_ME_FORBIDDEN, FETCH_ME_FULFILLED, FETCH_ME_REJECTED} from './actions';
import MeRepository from '../../repository/MeRepository';


export default function fetchMe() {
    return (dispatch) => {
        dispatch({ type: FETCH_ME });


        MeRepository.fetchMe()
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_ME_FULFILLED,
                        payload: json,
                    });
                }
                if (result.status === 403){
                    dispatch({type: FETCH_ME_FORBIDDEN})
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_ME_REJECTED,
                    payload: error,
                });
            });
    };
}
