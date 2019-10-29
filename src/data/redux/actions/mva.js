import { FETCH_MVA, FETCH_MVA_FULFILLED, FETCH_MVA_REJECTED } from './actions';
import MvaRepository from '../../repository/MvaRepository';


export default function fetchMva() {
  return (dispatch) => {
    dispatch({ type: FETCH_MVA });


    MvaRepository.fetchMvaCodes()
      .then(([result, json]) => {
        if (result.status === 200) {
          dispatch({
            type: FETCH_MVA_FULFILLED,
            payload: json,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: FETCH_MVA_REJECTED,
          payload: error,
        });
      });
  };
}
