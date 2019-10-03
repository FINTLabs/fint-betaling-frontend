import {
    INITIALIZE_PAYMENT,
    UPDATE_GROUP_CONTENT_OPEN,
    UPDATE_PAYMENT_SEARCH_BY,
    UPDATE_PAYMENT_SEARCH_VALUE,
    UPDATE_RECIPIENTS,
    UPDATE_SUGGESTIONS
} from "./actions";

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

export function updateSuggestions(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_SUGGESTIONS, payload: value});
    }
}

export function updateGroupContentOpen(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_GROUP_CONTENT_OPEN, payload: value});
    }
}

export function updateRecipients(value) {
    console.log("VALUE: ", value);
    return function (dispatch) {
        dispatch({type: UPDATE_RECIPIENTS, payload: value});
    }
}