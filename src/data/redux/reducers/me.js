import {FETCH_ME, FETCH_ME_FULFILLED, FETCH_ME_REJECTED} from '../actions/actions';


export const defaultState = {
    me: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case FETCH_ME:
            return {
                ...state,
                isLoading: true,
                loaded: false,
                error: false,
                errorMessage: '',
            };

        case FETCH_ME_FULFILLED:
            return {
                ...state,
                isLoading: false,
                loaded: true,
                me: action.payload,
            };

        case FETCH_ME_REJECTED:
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
