import React from 'react';
import {GROUP} from "../../constants";
import GroupTable from "./group_table";
import IndividualTable from "./individual_table";
import {useSelector} from "react-redux";

const RecipientSuggestItem = () => {
    const recipientType = useSelector(state => state.payment.form.searchBy).toString();
    const suggestions = useSelector(state => state.payment.form.filteredSuggestions);

    if (suggestions && suggestions.length > 1) {
        suggestions.sort((a, b) => {
            return (
                a.kundenummer ?
                    a.fulltNavn > b.fulltNavn ?
                        1 : -1
                    : a.navn > b.navn ?
                    1 : -1);
        });
    }

    function handleRecipientChecked(customerNumber) {
        console.log("customerNumber: ", customerNumber);
    }


    if (!suggestions) {
        return <div>loading....</div>
    }

    if (recipientType === GROUP) {
        return (
            <GroupTable onChange={handleRecipientChecked}/>
        );
    } else {
        return (
            <IndividualTable onChange={handleRecipientChecked}/>
        );
    }
};

export default RecipientSuggestItem;