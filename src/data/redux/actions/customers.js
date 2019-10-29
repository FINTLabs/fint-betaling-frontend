import { FETCH_CUSTOMERS, FETCH_CUSTOMERS_FULFILLED, FETCH_CUSTOMERS_REJECTED } from './actions';
import CustomerRepository from '../../repository/CustomerRepository';


export default function fetchCustomer() {
  return (dispatch) => {
    dispatch({ type: FETCH_CUSTOMERS });


    CustomerRepository.fetchCustomers()
      .then(([result, json]) => {
        if (result.status === 200) {
          dispatch({
            type: FETCH_CUSTOMERS_FULFILLED,
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
