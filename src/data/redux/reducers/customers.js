import {FETCH_CUSTOMERS, FETCH_CUSTOMERS_FULFILLED, FETCH_CUSTOMERS_REJECTED} from "../actions/actions";


export const defaultState = {
    customers: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: "",
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case FETCH_CUSTOMERS:
            return {...state, isLoading: true, loaded: false, error: false, errorMessage: ""};

        case FETCH_CUSTOMERS_FULFILLED:
            return {...state, isLoading: false, loaded: true, customers: action.payload};

        case FETCH_CUSTOMERS_REJECTED:
            return {...state, isLoading: false, loaded: false, error: true, errorMessage: action.payload};

        default:
            return state;
    }
}