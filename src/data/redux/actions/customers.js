import {FETCH_CUSTOMERS, FETCH_CUSTOMERS_FULFILLED, FETCH_CUSTOMERS_REJECTED} from "./actions";
import CustomerRepository from "../../repository/CustomerRepository";


export function fetchCustomer() {
    return function (dispatch) {
        dispatch({type: FETCH_CUSTOMERS});


        CustomerRepository.fetchCustomers().then(([result, json]) => {
            if (result.status === 200) {
                console.log("json", json);
                dispatch({type: FETCH_CUSTOMERS_FULFILLED, payload: json});
            }
        }).catch((error) => {
            dispatch({type: FETCH_CUSTOMERS_REJECTED, payload: error})
        });
    }
}