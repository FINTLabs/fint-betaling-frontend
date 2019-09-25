import {FETCH_GROUPS, FETCH_GROUPS_FULFILLED, FETCH_GROUPS_REJECTED} from "../actions/actions";


export const defaultState = {
    groups: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: "",
};

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case FETCH_GROUPS:
            return {...state, isLoading: true, loaded: false, error: false, errorMessage: ""};

        case FETCH_GROUPS_FULFILLED:
            return {...state, isLoading: false, loaded: true, groups: action.payload};

        case FETCH_GROUPS_REJECTED:
            return {...state, isLoading: false, loaded: false, error: true, errorMessage: action.payload};

        default:
            return state;

    }
}