import {FETCH_ORDER_LINES, FETCH_ORDER_LINES_FULFILLED, FETCH_ORDER_LINES_REJECTED} from "./actions";
import OrderLineRepository from "../../repository/OrderLineRepository";


export function fetchOrderLines() {
    return function (dispatch) {
        dispatch({type: FETCH_ORDER_LINES});


        OrderLineRepository.fetchOrderLines().then(([result, json]) => {
            if (result.status === 200) {
                dispatch({type: FETCH_ORDER_LINES_FULFILLED, payload: json});
            }
        }).catch((error) => {
            dispatch({type: FETCH_ORDER_LINES_REJECTED, payload: error})
        });
    }
}