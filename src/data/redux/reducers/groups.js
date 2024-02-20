import {
    FETCH_GROUPS, FETCH_GROUPS_FULFILLED, FETCH_GROUPS_REJECTED, UPDATE_GROUPS_LOADED,
} from '../actions/actions';

export const defaultState = {
    groups: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
    case FETCH_GROUPS:
        return {
            ...state,
            isLoading: true,
            loaded: false,
            error: false,
            errorMessage: '',
        };

    // case FETCH_GROUPS_FULFILLED:
    //     return {
    //         ...state,
    //         isLoading: false,
    //         loaded: true,
    //         groups: action.payload,
    //     };
    case FETCH_GROUPS_FULFILLED:
        // eslint-disable-next-line no-case-declarations
        let groups = action.payload;
        if (!Array.isArray(groups)) {
            groups = [groups]; // Convert to array if not already an array
        }
        if (groups.length > 1) {
            groups.sort(); // Sort only if it's an array
        }
        return {
            ...state,
            isLoading: false,
            loaded: true,
            groups,
        };
    case FETCH_GROUPS_REJECTED:
        return {
            ...state,
            isLoading: false,
            loaded: false,
            error: true,
            errorMessage: action.payload,
        };
    case UPDATE_GROUPS_LOADED:
        return {
            ...state,
            isLoading: action.payload,
            loaded: false,
            error: false,
        };

    default:
        return state;
    }
}
