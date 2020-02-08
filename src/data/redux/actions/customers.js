import _ from 'lodash';
import {
    FETCH_CUSTOMERS,
    FETCH_CUSTOMERS_FULFILLED,
    FETCH_CUSTOMERS_REJECTED,
    UPDATE_CUSTOMER_NAMES_SPLIT,
} from './actions';
import GroupRepository from '../../repository/GroupRepository';


export default function fetchCustomer(orgId, schoolOrgId) {
    return (dispatch) => {
        dispatch({ type: FETCH_CUSTOMERS });


        GroupRepository.fetchAllCustomersFromSchool(orgId, schoolOrgId)
            .then(([result, json]) => {
                if (result.status === 200) {
                    const customers = _.uniqBy(json.customers, (c) => c.id);
                    dispatch({
                        type: FETCH_CUSTOMERS_FULFILLED,
                        payload: customers,
                    });
                    dispatch({
                        type: UPDATE_CUSTOMER_NAMES_SPLIT,
                        payload: customers,
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
