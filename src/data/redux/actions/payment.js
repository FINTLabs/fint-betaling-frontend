import {ADD_RECIPIENT, INITIALIZE_PAYMENT, UPDATE_PAYMENT_SEARCH_BY, UPDATE_PAYMENT_SEARCH_VALUE} from "./actions";

export function initialiazePayment() {
    return function (dispatch) {
        dispatch({type: INITIALIZE_PAYMENT});
    }
}
export function updateSearchBy(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENT_SEARCH_BY, payload: value});
    }
}
export function updateSearchValue(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENT_SEARCH_VALUE, payload: value});
    }
}
export function addRecipient(value) {
    return function (dispatch) {
        dispatch({type: ADD_RECIPIENT, payload: value});
    }
}