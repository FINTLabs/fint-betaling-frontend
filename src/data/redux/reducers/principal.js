import { FETCH_PRINCIPALS, FETCH_PRINCIPALS_FULFILLED, FETCH_PRINCIPALS_REJECTED } from '../actions/actions';


export const defaultState = {
    principal: {},
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
    case FETCH_PRINCIPALS:
        return {
            ...state,
            isLoading: true,
            loaded: false,
            error: false,
            errorMessage: '',
        };

    case FETCH_PRINCIPALS_FULFILLED:
        return {
            ...state,
            isLoading: false,
            loaded: true,
            principal: action.payload,
        };

    case FETCH_PRINCIPALS_REJECTED:
        return {
            ...state,
            isLoading: false,
            loaded: false,
            error: true,
            errorMessage: action.payload,
        };

    default:
        return state;
    }
}
