import {
    CLEAR_RECIPIENTS,
    INITIALIZE_PAYMENT,
    UPDATE_BACK_END_RESPONSE,
    UPDATE_CONFIRM_RECIPIENTS_OPEN,
    UPDATE_CUSTOMERS_LOADED,
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
    UPDATE_PRODUCT_AMOUNT, UPDATE_PRODUCT_DESCRIPTION,
    UPDATE_PRODUCT_LENGTH, UPDATE_PRODUCT_PRICE,
    UPDATE_PRODUCT_SEARCH_VALUE,
    UPDATE_PRODUCT_SUGGESTIONS,
    UPDATE_PRODUCTS,
    UPDATE_RECIPIENTS,
    UPDATE_SCHOOL,
    UPDATE_SCHOOL_ORG_ID,
    UPDATE_SEARCH_PAGE,
    UPDATE_SELECTED_ORDERS_TO_EXTERNAL,
    UPDATE_SHOW_ALL_RECIPIENTS,
    UPDATE_STEP,
    UPDATE_SUGGESTION_LENGTH,
    UPDATE_SUGGESTIONS,
    UPDATE_TO_VALUE_EXTERNAL,
} from '../actions/actions';
import { GROUP, ORDER_NUMBER } from '../../../feature/payment/constants';

// TODO remove dummy values
export const defaultState = {
    payment: {
        orgId: '',
        school: '',
        schoolOrgId: '',
        groupsLoaded: false,
        customersLoaded: false,
        recipients: {},
        products: {},
        requestedNumberOfDaysToPaymentDeadLine: '',
        statusOpen: false,
        statusContent: '',
    },
    form: {
        step: 0,
        searchBy: GROUP,
        searchValue: '',
        filteredSuggestions: [],
        suggestionLength: 0,
        groupContentOpen: {},
        confirmRecipientsOpen: false,
        page: 0,
    },
    recipientList: {
        showAll: false,
    },
    product: {
        searchValue: '',
        productsLength: 0,
        filteredSuggestions: [],
        amount: {},
        itemPrice: {},
    },
    payments: {
        filter: 'ALL',
        searchValue: '',
        filteredSuggestions: [],
        searchBy: ORDER_NUMBER,
        dialogOpen: false,
        dialogOrderNumber: '',
        latestSent: [],
    },
    sendToExternalSystem: {
        ordersOpen: false,
        searchValue: '',
        selectedOrders: [],
        needFetch: true,
        loading: false,
        redirect: false,
    },
    backEndResponse: {
        responseOrder: '',
    },
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
    case INITIALIZE_PAYMENT:
        return defaultState;
    case UPDATE_PAYMENT_SEARCH_BY:
        return {
            ...state,
            form: {
                ...state.form,
                searchBy: action.payload,
            },
        };
    case UPDATE_PAYMENT_SEARCH_VALUE:
        return {
            ...state,
            form: {
                ...state.form,
                searchValue: action.payload,
            },
        };
    case UPDATE_SUGGESTIONS:
        return {
            ...state,
            form: {
                ...state.form,
                filteredSuggestions: action.payload,
            },
        };
    case UPDATE_GROUP_CONTENT_OPEN:
        return {
            ...state,
            form: {
                ...state.form,
                groupContentOpen: action.payload,
            },
        };
    case UPDATE_CONFIRM_RECIPIENTS_OPEN:
        return {
            ...state,
            form: {
                ...state.form,
                confirmRecipientsOpen: action.payload,
            },
        };
    case UPDATE_SEARCH_PAGE:
        return {
            ...state,
            form: {
                ...state.form,
                page: action.payload,
            },
        };
    case UPDATE_SUGGESTION_LENGTH:
        return {
            ...state,
            form: {
                ...state.form,
                suggestionLength: action.payload,
            },
        };
    case UPDATE_STEP:
        return {
            ...state,
            form: {
                ...state.form,
                step: action.payload,
            },
        };
    case UPDATE_PRODUCT_SEARCH_VALUE:
        return {
            ...state,
            product: {
                ...state.product,
                searchValue: action.payload,
            },
        };
    case UPDATE_PRODUCT_SUGGESTIONS:
        return {
            ...state,
            product: {
                ...state.product,
                filteredSuggestions: action.payload,
            },
        };
    case UPDATE_PRODUCT_LENGTH:
        return {
            ...state,
            product: {
                ...state.product,
                productsLength: action.payload,
            },
        };
    case UPDATE_RECIPIENTS:
        return {
            ...state,
            payment: {
                ...state.payment,
                recipients: action.payload,
            },
        };
    case UPDATE_PRODUCTS:
        return {
            ...state,
            payment: {
                ...state.payment,
                products: action.payload,
            },
        };
    case UPDATE_SCHOOL:
        return {
            ...state,
            payment: {
                ...state.payment,
                school: action.payload,
            },
        };
    case UPDATE_ORDER_STATUS_OPEN:
        return {
            ...state,
            payment: {
                ...state.payment,
                statusOpen: action.payload,
            },
        };
    case UPDATE_ORDER_STATUS_CONTENT:
        return {
            ...state,
            payment: {
                ...state.payment,
                statusContent: action.payload,
            },
        };
    case UPDATE_SCHOOL_ORG_ID:
        return {
            ...state,
            payment: {
                ...state.payment,
                schoolOrgId: action.payload,
            },
        };
    case UPDATE_ORG_ID:
        return {
            ...state,
            payment: {
                ...state.payment,
                orgId: action.payload,
            },
        };
    case UPDATE_GROUPS_LOADED:
        return {
            ...state,
            payment: {
                ...state.payment,
                groupsLoaded: action.payload,
            },
        };
    case UPDATE_CUSTOMERS_LOADED:
        return {
            ...state,
            payment: {
                ...state.payment,
                customersLoaded: action.payload,
            },
        };
    case UPDATE_PRODUCT_AMOUNT:
        return {
            ...state,
            product: {
                ...state.product,
                amount: action.payload,
            },
        };
    case UPDATE_PRODUCT_PRICE:
        return {
            ...state,
            product: {
                ...state.product,
                itemPrice: action.payload,
            },
        };
    case UPDATE_PRODUCT_DESCRIPTION:
        return {
            ...state,
            product: {
                ...state.product,
                description: action.payload,
            },
        };
    case UPDATE_PAYMENTS_SEARCH_BY:
        return {
            ...state,
            payments: {
                ...state.payments,
                searchBy: action.payload,
            },
        };
    case UPDATE_PAYMENT_FILTER_VALUE:
        return {
            ...state,
            payments: {
                ...state.payments,
                filter: action.payload,
            },
        };
    case UPDATE_PAYMENTS_SUGGESTIONS:
        return {
            ...state,
            payments: {
                ...state.payments,
                filteredSuggestions: action.payload,
            },
        };
    case UPDATE_PAYMENTS_SEARCH_VALUE:
        return {
            ...state,
            payments: {
                ...state.payments,
                searchValue: action.payload,
            },
        };
    case UPDATE_PAYMENTS_DIALOG_OPEN:
        return {
            ...state,
            payments: {
                ...state.payments,
                dialogOpen: action.payload,
            },
        };
    case UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER:
        return {
            ...state,
            payments: {
                ...state.payments,
                dialogOrderNumber: action.payload,
            },
        };
    case UPDATE_LATEST_SENT_PAYMENTS:
        return {
            ...state,
            payments: {
                ...state.payments,
                latestSent: action.payload,
            },
        };
    case UPDATE_SHOW_ALL_RECIPIENTS:
        return {
            ...state,
            recipientList: {
                showAll: action.payload,
            },
        };
    case CLEAR_RECIPIENTS:
        return {
            ...state,
            payment: {
                ...state.payment,
                recipients: {},
            },
        };
    case UPDATE_FROM_VALUE_EXTERNAL:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                fromValue: action.payload,
            },
        };
    case UPDATE_TO_VALUE_EXTERNAL:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                searchValue: action.payload,
            },
        };
    case UPDATE_SELECTED_ORDERS_TO_EXTERNAL:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                selectedOrders: action.payload,
            },
        };
    case UPDATE_NEED_FETCH:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                needFetch: action.payload,
            },
        };
    case UPDATE_LOADING_TO_EXTERNAL:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                loading: action.payload,
            },
        };
    case UPDATE_EXTERNAL_REDIRECT:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                redirect: action.payload,
            },
        };
    case UPDATE_BACK_END_RESPONSE:
        return {
            ...state,
            backEndResponse: {
                responseOrder: action.payload,
            },
        };
    case UPDATE_ORDERS_OPEN:
        return {
            ...state,
            sendToExternalSystem: {
                ...state.sendToExternalSystem,
                ordersOpen: action.payload,
            },
        };
    default:
        return state;
    }
}
