import {FETCH_MVA, FETCH_MVA_FULFILLED, FETCH_MVA_REJECTED} from "../actions/actions";


export const defaultState = {
    mva: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: "",
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case FETCH_MVA:
            return {...state, isLoading: true, loaded: false, error: false, errorMessage: ""};

        case FETCH_MVA_FULFILLED:
            return {...state, isLoading: false, loaded: true, mva: action.payload};

        case FETCH_MVA_REJECTED:
            return {...state, isLoading: false, loaded: false, error: true, errorMessage: action.payload};

        default:
            return state;

    }
}