import {
    FETCH_CUSTOMERS,
    FETCH_CUSTOMERS_FULFILLED,
    FETCH_CUSTOMERS_REJECTED,
    UPDATE_CUSTOMER_NAMES_SPLIT
} from './actions';
import CustomerRepository from '../../repository/CustomerRepository';


export default function fetchCustomer() {
    return (dispatch) => {
        dispatch({type: FETCH_CUSTOMERS});


        CustomerRepository.fetchCustomers()
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_CUSTOMERS_FULFILLED,
                        payload: json,
                    });
                    dispatch({
                        type: UPDATE_CUSTOMER_NAMES_SPLIT,
                        payload: json,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_CUSTOMERS_REJECTED,
                    payload: error,
                });
            });
    };
}
