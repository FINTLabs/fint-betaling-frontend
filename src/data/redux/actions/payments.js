import {ADD_NEW_PAYMENT, FETCH_PAYMENTS, FETCH_PAYMENTS_FULFILLED, FETCH_PAYMENTS_REJECTED} from "./actions";
import PaymentRepository from "../../repository/PaymentRepository";


export function fetchPayment() {
    return function (dispatch) {
        dispatch({type: FETCH_PAYMENTS});


        PaymentRepository.fetchPayments().then(([result, json]) => {
            console.log("Payments Result: ", result);
            console.log("Payments Json: ", json);
            if (result.status === 200) {
                dispatch({type: FETCH_PAYMENTS_FULFILLED, payload: json});
            }
        }).catch((error) => {
            dispatch({type: FETCH_PAYMENTS_REJECTED, payload: error})
        });
    }
}
export function addNewPayment() {
    return function (dispatch) {
        dispatch({type: ADD_NEW_PAYMENT});


        PaymentRepository.setPayment().then(([result, json]) => {
            console.log("Payments Result: ", result);
            console.log("Payments Json: ", json);
            if (result.status === 200) {
                dispatch({type: FETCH_PAYMENTS_FULFILLED, payload: json});
            }
        }).catch((error) => {
            dispatch({type: FETCH_PAYMENTS_REJECTED, payload: error})
        });
    }
}