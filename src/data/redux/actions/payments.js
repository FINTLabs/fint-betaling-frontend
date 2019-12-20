import { FETCH_PAYMENTS, FETCH_PAYMENTS_FULFILLED, FETCH_PAYMENTS_REJECTED } from './actions';
import ClaimRepository from '../../repository/ClaimRepository';


export default function fetchPayment() {
  return (dispatch) => {
    dispatch({ type: FETCH_PAYMENTS });


    ClaimRepository.fetchPayments()
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
