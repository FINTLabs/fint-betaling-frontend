import {FETCH_GROUPS, FETCH_GROUPS_FULFILLED, FETCH_GROUPS_REJECTED} from './actions';
import GroupRepository from '../../repository/GroupRepository';


export default function fetchGroup(orgId, schoolOrgId) {
    return (dispatch) => {
        dispatch({type: FETCH_GROUPS});
        GroupRepository.fetchAllBasisGroupsFromSchool(orgId, schoolOrgId)
            .then(([result, json]) => {
                if (result.status === 200) {
                    dispatch({
                        type: FETCH_GROUPS_FULFILLED,
                        payload: json,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_GROUPS_REJECTED,
                    payload: error,
                });
            });
    };
}

