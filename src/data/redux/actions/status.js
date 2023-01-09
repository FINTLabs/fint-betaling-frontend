import { FETCH_STATUS_COUNT_UNSENT, FETCH_STATUS_COUNT_ERROR } from './actions';
import ClaimRepository from '../../repository/ClaimRepository';

export default function fetchPaymentsStatusCount() {
    return (dispatch) => {
        dispatch({ type: FETCH_STATUS_COUNT_UNSENT });
        ClaimRepository.fetchPaymentsStatusCount('STORED')
            .then(([result, totalCount]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_STATUS_COUNT_UNSENT,
                        payload: totalCount,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_STATUS_COUNT_UNSENT,
                    payload: error,
                });
            });

        dispatch({ type: FETCH_STATUS_COUNT_ERROR });
        ClaimRepository.fetchPaymentsStatusCount('ERROR,SEND_ERROR,ACCEPT_ERROR,UPDATE_ERROR', 14)
            .then(([result, totalCount]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_STATUS_COUNT_ERROR,
                        payload: totalCount,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_STATUS_COUNT_ERROR,
                    payload: error,
                });
            });
    };
}
