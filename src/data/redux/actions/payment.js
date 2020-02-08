import {
    CLEAR_RECIPIENTS,
    INITIALIZE_PAYMENT,
    UPDATE_SHOW_ALL_RECIPIENTS,
    UPDATE_BACK_END_RESPONSE,
    UPDATE_CONFIRM_RECIPIENTS_OPEN,
    UPDATE_CUSTOMERS_LOADED,
    UPDATE_EXPIRATION_DATE,
    UPDATE_EXTERNAL_REDIRECT,
    UPDATE_FROM_VALUE_EXTERNAL,
    UPDATE_GROUP_CONTENT_OPEN,
    UPDATE_GROUPS_LOADED,
    UPDATE_LATEST_SENT_PAYMENTS,
    UPDATE_LOADING_TO_EXTERNAL,
    UPDATE_NEED_FETCH,
    UPDATE_ORDER_STATUS_CONTENT,
    UPDATE_ORDER_STATUS_OPEN,
    UPDATE_ORDERS_OPEN,
    UPDATE_ORG_ID,
    UPDATE_PAYMENT_FILTER_VALUE,
    UPDATE_PAYMENT_SEARCH_BY,
    UPDATE_PAYMENT_SEARCH_VALUE,
    UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER,
    UPDATE_PAYMENTS_DIALOG_OPEN,
    UPDATE_PAYMENTS_SEARCH_BY,
    UPDATE_PAYMENTS_SEARCH_VALUE,
    UPDATE_PAYMENTS_SUGGESTIONS,
    UPDATE_PRODUCT_AMOUNT,
    UPDATE_PRODUCT_LENGTH,
    UPDATE_PRODUCT_SEARCH_VALUE,
    UPDATE_PRODUCT_SUGGESTIONS,
    UPDATE_PRODUCTS,
    UPDATE_RECIPIENTS,
    UPDATE_SCHOOL,
    UPDATE_SCHOOL_ORG_ID,
    UPDATE_SEARCH_PAGE,
    UPDATE_SELECTED_ORDERS_TO_EXTERNAL,
    UPDATE_STEP,
    UPDATE_SUGGESTION_LENGTH,
    UPDATE_SUGGESTIONS,
    UPDATE_TO_VALUE_EXTERNAL,
} from './actions';

// TODO move functions to different files or sort them

export function initializePayment() {
    return (dispatch) => {
        dispatch({ type: INITIALIZE_PAYMENT });
    };
}

export function setOrgId(orgId) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ORG_ID,
            payload: orgId,
        });
    };
}

export function setSchool(school) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SCHOOL,
            payload: school,
        });
    };
}

export function setSchoolOrgId(schoolOrgId) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SCHOOL_ORG_ID,
            payload: schoolOrgId,
        });
    };
}

export function updateGroupsLoaded(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_GROUPS_LOADED,
            payload: value,
        });
    };
}

export function updateCustomersLoaded(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_CUSTOMERS_LOADED,
            payload: value,
        });
    };
}

export function updateSearchBy(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENT_SEARCH_BY,
            payload: value,
        });
    };
}

export function updateSearchValue(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENT_SEARCH_VALUE,
            payload: value,
        });
    };
}

export function updateSuggestions(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SUGGESTIONS,
            payload: value,
        });
    };
}

export function updateGroupContentOpen(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_GROUP_CONTENT_OPEN,
            payload: value,
        });
    };
}

export function updateRecipients(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_RECIPIENTS,
            payload: value,
        });
    };
}

export function updateStep(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_STEP,
            payload: value,
        });
    };
}

export function updateProductSearchValue(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT_SEARCH_VALUE,
            payload: value,
        });
    };
}

export function updateProductSuggestions(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT_SUGGESTIONS,
            payload: value,
        });
    };
}

export function updateProducts(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCTS,
            payload: value,
        });
    };
}

export function updateConfirmRecipientsOpen(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_CONFIRM_RECIPIENTS_OPEN,
            payload: value,
        });
    };
}

export function updateProductAmount(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT_AMOUNT,
            payload: value,
        });
    };
}

export function updateRequestedNumberOfDaysToPaymentDeadLine(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_EXPIRATION_DATE,
            payload: value,
        });
    };
}

export function updateSchool(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SCHOOL,
            payload: value,
        });
    };
}

export function updatePaymentsSearchValue(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENTS_SEARCH_VALUE,
            payload: value,
        });
    };
}

export function updatePaymentsSuggestions(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENTS_SUGGESTIONS,
            payload: value,
        });
    };
}

export function updatePaymentsSearchBy(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENTS_SEARCH_BY,
            payload: value,
        });
    };
}

export function updatePaymentsDialogOpen(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENTS_DIALOG_OPEN,
            payload: value,
        });
    };
}

export function updatePaymentsDialogOrderNumber(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER,
            payload: value,
        });
    };
}

export function updateSearchPage(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SEARCH_PAGE,
            payload: value,
        });
    };
}

export function updateSuggestionLength(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SUGGESTION_LENGTH,
            payload: value,
        });
    };
}

export function updateProductLength(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT_LENGTH,
            payload: value,
        });
    };
}

export function updateShowAllRecipients(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SHOW_ALL_RECIPIENTS,
            payload: value,
        });
    };
}

export function clearRecipients() {
    return (dispatch) => {
        dispatch({
            type: CLEAR_RECIPIENTS,
        });
    };
}

export function updateSentPayment(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_LATEST_SENT_PAYMENTS,
            payload: value,
        });
    };
}

export function updateFromValue(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_FROM_VALUE_EXTERNAL,
            payload: value,
        });
    };
}

export function updateOrderSearchValue(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_TO_VALUE_EXTERNAL,
            payload: value,
        });
    };
}

export function updateSelectedOrders(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SELECTED_ORDERS_TO_EXTERNAL,
            payload: value,
        });
    };
}

export function updateNeedFetch(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_NEED_FETCH,
            payload: value,
        });
    };
}

export function updateLoadingSendingInvoice(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_LOADING_TO_EXTERNAL,
            payload: value,
        });
    };
}

export function updateRedirectFromExternal(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_EXTERNAL_REDIRECT,
            payload: value,
        });
    };
}

export function updateSendOrderResponse(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_BACK_END_RESPONSE,
            payload: value,
        });
    };
}

export function updateOrderStatusContent(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ORDER_STATUS_CONTENT,
            payload: value,
        });
    };
}

export function updateOrderStatusOpen(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ORDER_STATUS_OPEN,
            payload: value,
        });
    };
}

export function updatePaymentFilterValue(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENT_FILTER_VALUE,
            payload: value,
        });
    };
}

export function updateOrdersOpen(value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ORDERS_OPEN,
            payload: value,
        });
    };
}
