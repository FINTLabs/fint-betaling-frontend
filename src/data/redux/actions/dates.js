import {FETCH_DATES, FETCH_DATES_FULFILLED, FETCH_DATES_REJECTED} from "./actions";
import DateRepository from "../../repository/DateRepository";


export function fetchDate() {
    return function (dispatch) {
        dispatch({type: FETCH_DATES});


        DateRepository.fetchDates().then(([result, json]) => {
            if (result.status === 200) {
                dispatch({type: FETCH_DATES_FULFILLED, payload: json});
            }
        }).catch((error) => {
            dispatch({type: FETCH_DATES_REJECTED, payload: error})
        });
    }
}