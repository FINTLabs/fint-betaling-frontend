import {
  FETCH_PAYMENTS, FETCH_PAYMENTS_FULFILLED, FETCH_PAYMENTS_REJECTED,
} from './actions';
import PaymentRepository from '../../repository/PaymentRepository';


export function fetchPayment() {
  return (dispatch) => {
    dispatch({ type: FETCH_PAYMENTS });


    PaymentRepository.fetchPayments()
      .then(([result, json]) => {
        if (result.status === 200) {
          dispatch({
            type: FETCH_PAYMENTS_FULFILLED,
            payload: json,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: FETCH_PAYMENTS_REJECTED,
          payload: error,
        });
      });
  };
}