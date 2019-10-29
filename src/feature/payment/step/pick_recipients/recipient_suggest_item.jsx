import React from 'react';
import { useSelector } from 'react-redux';
import { GROUP } from '../../constants';
import GroupTable from './group_table';
import IndividualTable from './individual_table';

const RecipientSuggestItem = () => {
  const recipientType = useSelector((state) => state.payment.form.searchBy)
    .toString();
  const suggestions = useSelector((state) => state.payment.form.filteredSuggestions);

  if (suggestions && suggestions.length > 1) {
    suggestions.sort((a, b) => (
      a.kundenummer
        ? a.fulltNavn > b.fulltNavn
          ? 1 : -1
        : a.navn > b.navn
          ? 1 : -1));
  }

  if (recipientType === GROUP) {
    return (
      <GroupTable />
    );
  }
  return (
    <IndividualTable />
  );
};

export default RecipientSuggestItem;
