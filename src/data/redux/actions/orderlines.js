import { FETCH_ORDER_LINES, FETCH_ORDER_LINES_FULFILLED, FETCH_ORDER_LINES_REJECTED } from './actions';
import LineItemRepository from '../../repository/LineItemRepository';


export default function fetchOrderLines() {
    return (dispatch) => {
        dispatch({ type: FETCH_ORDER_LINES });


        LineItemRepository.fetchOrderLines()
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_ORDER_LINES_FULFILLED,
                        payload: json,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_ORDER_LINES_REJECTED,
                    payload: error,
                });
            });
    };
}
