import {
    FETCH_PAYMENTS,
    FETCH_PAYMENTS_FULFILLED,
    FETCH_PAYMENTS_REJECTED,
    FETCH_STATUS_COUNT,
} from '../actions/actions';

export const defaultState = {
    payments: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
    statusCount: 0,
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
    case FETCH_PAYMENTS:
        return {
            ...state,
            isLoading: true,
            loaded: false,
            error: false,
            errorMessage: '',
        };

    case FETCH_PAYMENTS_FULFILLED:
        return {
            ...state,
            isLoading: false,
            loaded: true,
            payments: action.payload,
        };

    case FETCH_PAYMENTS_REJECTED:
        return {
            ...state,
            isLoading: false,
            loaded: false,
            error: true,
            errorMessage: action.payload,
        };

    case FETCH_STATUS_COUNT:
        return {
            ...state,
            statusCount: action.payload,
        };

    default:
        return state;
    }
}
