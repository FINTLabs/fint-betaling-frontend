import {
    INITIALIZE_PAYMENT,
    UPDATE_GROUP_CONTENT_OPEN,
    UPDATE_PAYMENT_SEARCH_BY,
    UPDATE_PAYMENT_SEARCH_VALUE,
    UPDATE_RECIPIENTS,
    UPDATE_SUGGESTIONS
} from "../actions/actions";
import {GROUP} from "../../../feature/payment/constants";

export const defaultState = {
    payment: {
        recipients: {},
    },
    form: {
        step: 0,
        searchBy: GROUP,
        searchValue: '',
        filteredSuggestions: [],
        groupContentOpen: {},
    },
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case INITIALIZE_PAYMENT:
            return defaultState;
        case UPDATE_PAYMENT_SEARCH_BY:
            return {...state,
                form: {searchBy: action.payload, searchValue: state.form.searchValue, step: state.form.step, filteredSuggestions: state.form.filteredSuggestions, groupContentOpen: state.form.groupContentOpen}};
        case UPDATE_PAYMENT_SEARCH_VALUE:
            return {
                ...state,
                form: {searchValue: action.payload, searchBy: state.form.searchBy, step: state.form.step, filteredSuggestions: state.form.filteredSuggestions, groupContentOpen: state.form.groupContentOpen}
            };
        case UPDATE_SUGGESTIONS:
            return {
                ...state,
                form: {filteredSuggestions: action.payload, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step, groupContentOpen: state.form.groupContentOpen}
            };
        case UPDATE_GROUP_CONTENT_OPEN:
            return {
                ...state,
                form: {groupContentOpen: action.payload, filteredSuggestions: state.form.filteredSuggestions, searchValue: state.form.searchValue, searchBy: state.form.searchBy, step: state.form.step}
            };
        case UPDATE_RECIPIENTS:
            console.log("ACTION.VALUE: ", action.payload);
            return {
                ...state,
                payment: {
                    recipients: action.payload,
                }

            };
        /*case UPDATE_PAYMENT_STEP:
            return {
                ...state,
                form: {searchValue: action.payload, searchBy: state.form.searchBy, step: state.form.step}
            };*/
        default:
            return state;

    }
}