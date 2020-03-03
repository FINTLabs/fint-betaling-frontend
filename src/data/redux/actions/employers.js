import { FETCH_EMPLOYERS, FETCH_EMPLOYERS_FULFILLED, FETCH_EMPLOYERS_REJECTED } from './actions';
import PrincipalRepository from '../../repository/PrincipalRepository';


export default function fetchEmployer(orgId) {
    return (dispatch) => {
        dispatch({ type: FETCH_EMPLOYERS });


        PrincipalRepository.fetchEmployers(orgId)
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_EMPLOYERS_FULFILLED,
                        payload: json,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_EMPLOYERS_REJECTED,
                    payload: error,
                });
            });
    };
}
