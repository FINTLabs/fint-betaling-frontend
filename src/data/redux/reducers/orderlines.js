import { FETCH_ORDER_LINES, FETCH_ORDER_LINES_FULFILLED, FETCH_ORDER_LINES_REJECTED } from '../actions/actions';


export const defaultState = {
    orderLines: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
    case FETCH_ORDER_LINES:
        return {
            ...state,
            isLoading: true,
            loaded: false,
            error: false,
            errorMessage: '',
        };

    case FETCH_ORDER_LINES_FULFILLED:
        return {
            ...state,
            isLoading: false,
            loaded: true,
            orderLines: action.payload,
        };

    case FETCH_ORDER_LINES_REJECTED:
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
