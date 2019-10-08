import {
    INITIALIZE_PAYMENT,
    UPDATE_CONFIRM_RECIPIENTS_OPEN,
    UPDATE_GROUP_CONTENT_OPEN, UPDATE_NEW_PRODUCT_OPEN,
    UPDATE_PAYMENT_SEARCH_BY,
    UPDATE_PAYMENT_SEARCH_VALUE,
    UPDATE_PRODUCT_AMOUNT,
    UPDATE_PRODUCT_SEARCH_VALUE,
    UPDATE_PRODUCT_SUGGESTIONS,
    UPDATE_PRODUCTS,
    UPDATE_RECIPIENTS,
    UPDATE_STEP,
    UPDATE_SUGGESTIONS
} from "../actions/actions";
import {GROUP} from "../../../feature/payment/constants";

export const defaultState = {
    payment: {
        recipients: {},
        products: {},
    },
    form: {
        step: 0,
        searchBy: GROUP,
        searchValue: '',
        filteredSuggestions: [],
        groupContentOpen: {},
        confirmRecipientsOpen: false,
    },
    product: {
        searchValue: '',
        filteredSuggestions: [],
        amount: [],
    },
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case INITIALIZE_PAYMENT:
            return defaultState;
        case UPDATE_PAYMENT_SEARCH_BY:
            return {...state,
                form: {searchBy: action.payload, searchValue: state.form.searchValue, step: state.form.step, filteredSuggestions: state.form.filteredSuggestions, groupContentOpen: state.form.groupContentOpen, confirmRecipientsOpen: state.form.confirmRecipientsOpen,}};
        case UPDATE_PAYMENT_SEARCH_VALUE:
            return {
                ...state,
                form: {searchValue: action.payload, searchBy: state.form.searchBy, step: state.form.step, filteredSuggestions: state.form.filteredSuggestions, groupContentOpen: state.form.groupContentOpen, confirmRecipientsOpen: state.form.confirmRecipientsOpen,}
            };
        case UPDATE_SUGGESTIONS:
            return {
                ...state,
                form: {filteredSuggestions: action.payload, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen, confirmRecipientsOpen: state.form.confirmRecipientsOpen,}
            };
        case UPDATE_GROUP_CONTENT_OPEN:
            return {
                ...state,
                form: {groupContentOpen: action.payload, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, confirmRecipientsOpen: state.form.confirmRecipientsOpen,}
            };
        case UPDATE_CONFIRM_RECIPIENTS_OPEN:
            return {
                ...state,
                form: {confirmRecipientsOpen: action.payload, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen,}
            };
        case UPDATE_RECIPIENTS:
            return {
                ...state,
                payment: {
                    recipients: action.payload, products: state.payment.products,
                }
            };
        case UPDATE_STEP:
            return {
                ...state,
                form: {step: action.payload, groupContentOpen: state.form.groupContentOpen, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy}
            };
        case UPDATE_PRODUCT_SEARCH_VALUE:
            return {
                ...state,
                product: {
                    searchValue: action.payload, filteredSuggestions : state.product.filteredSuggestions, amount: state.product.amount,
                }
            };
        case UPDATE_PRODUCT_SUGGESTIONS:
            return {
                ...state,
                product: {
                    filteredSuggestions: action.payload, searchValue : state.product.searchValue, amount: state.product.amount,
                }
            };
        case UPDATE_PRODUCTS:
            return {
                ...state,
                payment: {
                    products: action.payload, recipients : state.payment.recipients,
                }
            };
        case UPDATE_PRODUCT_AMOUNT:
            return {
                ...state,
                product: {
                    amount: action.payload, searchValue: state.product.searchValue, filteredSuggestions :state.product.filteredSuggestions,
                }
            };

        default:
            return state;

    }
}