import React from 'react';
import {useSelector} from 'react-redux';
import {GROUP} from '../../constants';
import GroupTable from './group_table';
import IndividualTable from './individual_table';

const RecipientSuggestItem = () => {
    const recipientType = useSelector((state) => state.payment.form.searchBy)
        .toString();
    const suggestions = useSelector((state) => state.payment.form.filteredSuggestions);
    const searchValue = useSelector(state => state.payment.form.searchValue);

    if (searchValue.trim().length > 0) {

        if (suggestions && suggestions.length > 1) {
            suggestions.sort((a, b) => (
                a.name > b.name
                    ? 1 : -1
            ));
        }

        if (recipientType === GROUP) {
            return (
                <GroupTable/>
            );
        }
        return (
            <IndividualTable/>
        );
    } else {
        return <div/>
    }
};

export default RecipientSuggestItem;
