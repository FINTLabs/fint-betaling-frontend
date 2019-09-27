import React from 'react';
import {GROUP, INDIVIDUAL} from "../../constants";
import GroupTable from "./group_table";
import IndividualTable from "./individual_table";
import {useSelector} from "react-redux";

const RecipientSuggestItem = (props) => {
    const {suggestions, query} = props;
    let recipientType;
    suggestions.sort((a, b) => {
        recipientType = a.kundenummer ? INDIVIDUAL : GROUP;
        return (
            suggestions.length > 0 ?
                a.kundenummer ?
                    a.fulltNavn > b.fulltNavn ?
                        1 : -1
                    : a.navn > b.navn ?
                    1 : -1 : null)
    });

function handleRecipientChecked(event) {
    console.log(event.target.value);
}


    if (!suggestions) {
        return <div>loading....</div>
    }
    if (recipientType === GROUP) {
        return (
            <GroupTable suggestions={suggestions} query={query} onChange={handleRecipientChecked}/>
        );
    } else {
        return (
            <IndividualTable suggestions={suggestions} query={query} onChange={handleRecipientChecked}/>
        );
    }
};

export default RecipientSuggestItem;