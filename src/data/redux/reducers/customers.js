import {
    FETCH_CUSTOMERS,
    FETCH_CUSTOMERS_FULFILLED,
    FETCH_CUSTOMERS_REJECTED,
    UPDATE_CUSTOMER_NAMES_SPLIT
} from '../actions/actions';


export const defaultState = {
    customers: [],
    isLoading: false,
    loaded: false,
    error: false,
    errorMessage: '',
    namesSplit: {},
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case FETCH_CUSTOMERS:
            return {
                ...state,
                isLoading: true,
                loaded: false,
                error: false,
                errorMessage: '',
            };

        case FETCH_CUSTOMERS_FULFILLED:
            action.payload.sort((a, b) => (
                a.name > b.name ? 1:-1
                )
            );
            return {
                ...state,
                isLoading: false,
                loaded: true,
                customers: action.payload,
            };

        case FETCH_CUSTOMERS_REJECTED:
            return {
                ...state,
                isLoading: false,
                loaded: false,
                error: true,
                errorMessage: action.payload,
            };
      case UPDATE_CUSTOMER_NAMES_SPLIT:
          let array = [];
          action.payload.map(entry =>
          array[entry.id] = entry.name.split(" "));
        console.log("lengde burde værre: ", action.payload.length, " og ikke: ", array.length);
          console.log("Her er resultat: ", array);
            return {
                ...state,
                isLoading: false,
                loaded: true,
                customers: state.customers,
                namesSplit: array,
            };

        default:
            return state;
    }
}
