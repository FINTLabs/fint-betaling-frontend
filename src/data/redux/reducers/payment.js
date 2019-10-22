import {
    INITIALIZE_PAYMENT,
    UPDATE_CONFIRM_RECIPIENTS_OPEN,
    UPDATE_EXPIRATION_DATE,
    UPDATE_GROUP_CONTENT_OPEN,
    UPDATE_NEW_PRODUCT_OPEN,
    UPDATE_PAYMENT_SEARCH_BY,
    UPDATE_PAYMENT_SEARCH_VALUE, UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER,
    UPDATE_PAYMENTS_DIALOG_OPEN,
    UPDATE_PAYMENTS_SEARCH_BY,
    UPDATE_PAYMENTS_SEARCH_VALUE,
    UPDATE_PAYMENTS_SUGGESTIONS,
    UPDATE_PRODUCT_AMOUNT, UPDATE_PRODUCT_LENGTH,
    UPDATE_PRODUCT_SEARCH_VALUE,
    UPDATE_PRODUCT_SUGGESTIONS,
    UPDATE_PRODUCTS, UPDATE_RECIPIENT_LIST_OPEN,
    UPDATE_RECIPIENTS,
    UPDATE_SCHOOL, UPDATE_SEARCH_PAGE,
    UPDATE_STEP, UPDATE_SUGGESTION_LENGTH,
    UPDATE_SUGGESTIONS
} from "../actions/actions";
import {GROUP, ORDER_NUMBER} from "../../../feature/payment/constants";
import payments from "./payments";

export const defaultState = {
    payment: {
        school: 'dummyvalue',
        recipients: {},
        products: {},
        expirationDate: '',
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
    recipientList:{
        open: false,
    },
    product: {
        searchValue: '',
        productsLength: 0,
        filteredSuggestions: [],
        amount: [],
    },
    payments:{
        searchValue: '',
        filteredSuggestions: [],
        searchBy: ORDER_NUMBER,
        dialogOpen: false,
        dialogOrderNumber: '',
    }
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case INITIALIZE_PAYMENT:
            return defaultState;
        case UPDATE_PAYMENT_SEARCH_BY:
            return {...state,
                form: {searchBy: action.payload, searchValue: state.form.searchValue, step: state.form.step, filteredSuggestions: state.form.filteredSuggestions, groupContentOpen: state.form.groupContentOpen, confirmRecipientsOpen: state.form.confirmRecipientsOpen, page: state.form.page,suggestionLength: state.form.suggestionLength}
            };
        case UPDATE_PAYMENT_SEARCH_VALUE:
            return {
                ...state,
                form: {searchValue: action.payload, searchBy: state.form.searchBy, step: state.form.step, filteredSuggestions: state.form.filteredSuggestions, groupContentOpen: state.form.groupContentOpen, confirmRecipientsOpen: state.form.confirmRecipientsOpen, page: state.form.page,suggestionLength: state.form.suggestionLength}
            };
        case UPDATE_SUGGESTIONS:
            return {
                ...state,
                form: {filteredSuggestions: action.payload, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen, confirmRecipientsOpen: state.form.confirmRecipientsOpen, page: state.form.page,suggestionLength: state.form.suggestionLength}
            };
        case UPDATE_GROUP_CONTENT_OPEN:
            return {
                ...state,
                form: {groupContentOpen: action.payload, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, confirmRecipientsOpen: state.form.confirmRecipientsOpen, page: state.form.page,suggestionLength: state.form.suggestionLength}
            };
        case UPDATE_CONFIRM_RECIPIENTS_OPEN:
            return {
                ...state,
                form: {confirmRecipientsOpen: action.payload, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen, page: state.form.page,suggestionLength: state.form.suggestionLength}
            };
        case UPDATE_SEARCH_PAGE:
            return {
                ...state,
                form: {page: action.payload ,confirmRecipientsOpen: state.form.confirmRecipientsOpen, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen, suggestionLength: state.form.suggestionLength}
            };
        case UPDATE_SUGGESTION_LENGTH:
            return {
                ...state,
                form: {suggestionLength: action.payload ,confirmRecipientsOpen: state.form.confirmRecipientsOpen, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen, page: state.form.page}
            };
        case UPDATE_RECIPIENTS:
            return {
                ...state,
                payment: {
                    recipients: action.payload, products: state.payment.products, expirationDate: state.payment.expirationDate, school: state.payment.school,
                }
            };
        case UPDATE_STEP:
            return {
                ...state,
                form: {step: action.payload, groupContentOpen: state.form.groupContentOpen, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, page: state.form.page}
            };
        case UPDATE_PRODUCT_SEARCH_VALUE:
            return {
                ...state,
                product: {
                    searchValue: action.payload, filteredSuggestions : state.product.filteredSuggestions, amount: state.product.amount, productsLength: state.product.productsLength,
                }
            };
        case UPDATE_PRODUCT_SUGGESTIONS:
            return {
                ...state,
                product: {
                    filteredSuggestions: action.payload, searchValue : state.product.searchValue, amount: state.product.amount, productsLength: state.product.productsLength,
                }
            };
        case UPDATE_PRODUCT_LENGTH:
            return {
                ...state,
                product: {
                    productsLength: action.payload,filteredSuggestions: state.product.filteredSuggestions, searchValue : state.product.searchValue, amount: state.product.amount,
                }
            };
        case UPDATE_PRODUCTS:
            return {
                ...state,
                payment: {
                    products: action.payload, recipients : state.payment.recipients, expirationDate: state.payment.expirationDate, school: state.payment.school,
                }
            };
        case UPDATE_EXPIRATION_DATE:
            return {
                ...state,
                payment: {
                    expirationDate: action.payload, recipients : state.payment.recipients, products: state.payment.products, school: state.payment.school,
                }
            };
        case UPDATE_SCHOOL:
            return {
                ...state,
                payment: {
                    school: action.payload, recipients : state.payment.recipients, products: state.payment.products, expirationDate: state.payment.expirationDate,
                }
            };
        case UPDATE_PRODUCT_AMOUNT:
            return {
                ...state,
                product: {
                    amount: action.payload, searchValue: state.product.searchValue, filteredSuggestions :state.product.filteredSuggestions, productsLength: state.product.productsLength,
                }
            };
        case UPDATE_PAYMENTS_SEARCH_BY:
            return {
                ...state,
                payments: {
                    searchBy: action.payload, searchValue: state.payments.searchValue, filteredSuggestions : state.payments.filteredSuggestions, dialogOpen: state.payments.dialogOpen, dialogOrderNumber: state.payments.dialogOrderNumber,
                }
            };
        case UPDATE_PAYMENTS_SUGGESTIONS:
            return {
                ...state,
                payments: {
                    filteredSuggestions: action.payload, searchBy: state.payments.searchBy, searchValue : state.payments.searchValue, dialogOpen: state.payments.dialogOpen, dialogOrderNumber: state.payments.dialogOrderNumber,
                }
            };
        case UPDATE_PAYMENTS_SEARCH_VALUE:
            return {
                ...state,
                payments: {
                    searchValue: action.payload, searchBy: state.payments.searchBy, filteredSuggestions : state.payments.filteredSuggestions, dialogOpen: state.payments.dialogOpen, dialogOrderNumber: state.payments.dialogOrderNumber,
                }
            };
        case UPDATE_PAYMENTS_DIALOG_OPEN:
            return {
                ...state,
                payments: {
                    dialogOpen: action.payload ,searchValue: state.payments.searchValue, searchBy: state.payments.searchBy, filteredSuggestions : state.payments.filteredSuggestions, dialogOrderNumber: state.payments.dialogOrderNumber,
                }
            };
        case UPDATE_PAYMENTS_DIALOG_CONTENT_ORDER_NUMBER:
            return {
                ...state,
                payments: {
                    dialogOrderNumber: action.payload ,dialogOpen: state.payments.dialogOpen ,searchValue: state.payments.searchValue, searchBy: state.payments.searchBy, filteredSuggestions : state.payments.filteredSuggestions,
                }
            };
        case UPDATE_RECIPIENT_LIST_OPEN:
            return {
                ...state,
                recipientList: {
                    open: action.payload,
                }
            };
        default:
            return state;

    }
}