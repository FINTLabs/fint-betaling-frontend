import { FETCH_STATUS_COUNT_UNSENDT, FETCH_STATUS_COUNT_ERROR } from './actions';
import ClaimRepository from '../../repository/ClaimRepository';

export default function fetchPaymentsStatusCount() {
    return (dispatch) => {
        dispatch({ type: FETCH_STATUS_COUNT_UNSENDT });
        ClaimRepository.fetchPaymentsStatusCount('STORED')
            .then(([result, totalCount]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_STATUS_COUNT_UNSENDT,
                        payload: totalCount,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_STATUS_COUNT_UNSENDT,
                    payload: error,
                });
            });

        dispatch({ type: FETCH_STATUS_COUNT_ERROR });
        ClaimRepository.fetchPaymentsStatusCount('ERROR,SEND_ERROR,ACCEPT_ERROR,UPDATE_ERROR')
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
