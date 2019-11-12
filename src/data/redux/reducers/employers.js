import {FETCH_EMPLOYERS, FETCH_EMPLOYERS_FULFILLED, FETCH_EMPLOYERS_REJECTED} from '../actions/actions';


export const defaultState = {
    employers: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case FETCH_EMPLOYERS:
            return {
                ...state,
                isLoading: true,
                loaded: false,
                error: false,
                errorMessage: '',
            };

        case FETCH_EMPLOYERS_FULFILLED:
            return {
                ...state,
                isLoading: false,
                loaded: true,
                employers: action.payload,
            };

        case FETCH_EMPLOYERS_REJECTED:
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
