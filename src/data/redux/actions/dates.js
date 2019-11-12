import {FETCH_DATES, FETCH_DATES_FULFILLED, FETCH_DATES_REJECTED} from './actions';
import DateRangeRepository from '../../repository/DateRangeRepository';


export default function fetchDate() {
    return (dispatch) => {
        dispatch({type: FETCH_DATES});


        DateRangeRepository.fetchDates()
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_DATES_FULFILLED,
                        payload: json,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_DATES_REJECTED,
                    payload: error,
                });
            });
    };
}
