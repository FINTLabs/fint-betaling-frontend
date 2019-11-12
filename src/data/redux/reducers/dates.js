import {FETCH_DATES, FETCH_DATES_FULFILLED, FETCH_DATES_REJECTED} from '../actions/actions';


export const defaultState = {
    dates: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case FETCH_DATES:
            return {
                ...state,
                isLoading: true,
                loaded: false,
                error: false,
                errorMessage: '',
            };

        case FETCH_DATES_FULFILLED:
            return {
                ...state,
                isLoading: false,
                loaded: true,
                dates: action.payload,
            };

        case FETCH_DATES_REJECTED:
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
