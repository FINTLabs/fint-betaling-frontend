import React from 'react';
import {GROUP} from "../../constants";
import GroupTable from "./group_table";
import IndividualTable from "./individual_table";

const RecipientSuggestItem = (props) => {
    const {suggestions, query, recipientType} = props;

    if (suggestions.length > 1) {
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
        if (query.length === 0){
            return <GroupTable suggestions={[]} query={query} onChange={handleRecipientChecked}/>
        }
        return (
            <GroupTable suggestions={suggestions} query={query} onChange={handleRecipientChecked}/>
        );
    } else {
        if (query.length === 0){
            return <IndividualTable suggestions={[]} query={query} onChange={handleRecipientChecked}/>
        }
        return (
            <IndividualTable suggestions={suggestions} query={query} onChange={handleRecipientChecked}/>
        );
    }
};

export default RecipientSuggestItem;