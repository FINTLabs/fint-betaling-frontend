import {INITIALIZE_PAYMENT, UPDATE_PAYMENT_SEARCH_BY, UPDATE_PAYMENT_SEARCH_VALUE} from "../actions/actions";

export const defaultState = {
    payment: {
        recipients: []
    },
    form: {
        step: 0,
        searchBy: 'group',
        searchValue: '',
    }
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case INITIALIZE_PAYMENT:
            return defaultState;
        case UPDATE_PAYMENT_SEARCH_BY:
            return {...state,
                form: {searchBy: action.payload, searchValue: state.form.searchValue, step: state.form.step}};
        case UPDATE_PAYMENT_SEARCH_VALUE:
            return {
                ...state,
                form: {searchValue: action.payload, searchBy: state.form.searchBy, step: state.form.step}
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