import {FETCH_EMPLOYERS, FETCH_EMPLOYERS_FULFILLED, FETCH_EMPLOYERS_REJECTED} from "./actions";
import EmployerRepository from "../../repository/EmployerRepository";


export function fetchEmployer() {
    return function (dispatch) {
        dispatch({type: FETCH_EMPLOYERS});


        EmployerRepository.fetchEmployers().then(([result, json]) => {
            if (result.status === 200) {
                dispatch({type: FETCH_EMPLOYERS_FULFILLED, payload: json});
            }
        }).catch((error) => {
            dispatch({type: FETCH_EMPLOYERS_REJECTED, payload: error})
        });
    }
}