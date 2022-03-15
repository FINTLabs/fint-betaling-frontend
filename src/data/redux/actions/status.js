import { FETCH_STATUS_COUNT } from './actions';
import ClaimRepository from '../../repository/ClaimRepository';

export default function fetchPaymentsStatusCount(statusToGet) {
    return (dispatch) => {
        dispatch({ type: FETCH_STATUS_COUNT });
        ClaimRepository.fetchPaymentsStatusCount(statusToGet)
            .then(([result, totalCount]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_STATUS_COUNT,
                        payload: totalCount,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_STATUS_COUNT,
                    payload: error,
                });
            });
    };
}
