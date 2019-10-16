import {
    INITIALIZE_PAYMENT,
    UPDATE_CONFIRM_RECIPIENTS_OPEN,
    UPDATE_EXPIRATION_DATE,
    UPDATE_GROUP_CONTENT_OPEN,
    UPDATE_NEW_PRODUCT_OPEN,
    UPDATE_PAYMENT_ORDER_SEARCH_VALUE,
    UPDATE_PAYMENT_SEARCH_BY,
    UPDATE_PAYMENT_SEARCH_VALUE, UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER,
    UPDATE_PAYMENTS_DIALOG_OPEN,
    UPDATE_PAYMENTS_SEARCH_BY,
    UPDATE_PAYMENTS_SEARCH_VALUE,
    UPDATE_PAYMENTS_SUGGESTIONS,
    UPDATE_PRODUCT_AMOUNT,
    UPDATE_PRODUCT_SEARCH_VALUE,
    UPDATE_PRODUCT_SUGGESTIONS,
    UPDATE_PRODUCTS,
    UPDATE_RECIPIENTS,
    UPDATE_SCHOOL,
    UPDATE_STEP,
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
    return function (dispatch) {
        dispatch({type: UPDATE_RECIPIENTS, payload: value});
    }
}

export function updateStep(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_STEP, payload: value});
    }
}

export function updateProductSearchValue(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PRODUCT_SEARCH_VALUE, payload: value});
    }
}
export function updateProductSuggestions(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PRODUCT_SUGGESTIONS, payload: value});
    }
}
export function updateProducts(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PRODUCTS, payload: value});
    }
}
export function updateConfirmRecipientsOpen(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_CONFIRM_RECIPIENTS_OPEN, payload: value});
    }
}
export function updateProductAmount(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PRODUCT_AMOUNT, payload: value});
    }
}
export function updateExpirationDate(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_EXPIRATION_DATE, payload: value});
    }
}
export function updateSchool(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_SCHOOL, payload: value});
    }
}

export function updatePaymentsSearchValue(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENTS_SEARCH_VALUE, payload: value});
    }
}

export function updatePaymentsSuggestions(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENTS_SUGGESTIONS, payload: value});
    }
}
export function updatePaymentsSearchBy(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENTS_SEARCH_BY, payload: value});
    }
}
export function updatePaymentsDialogOpen(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENTS_DIALOG_OPEN, payload: value});
    }
}
export function updatePaymentsDialogOrderNumber(value) {
    return function (dispatch) {
        dispatch({type: UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER, payload: value});
    }
}