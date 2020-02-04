import {FILTER_ALL, ORDER_NUMBER} from '../constants';

export default function filterSuggestions(input, suggestions, searchBy, filterValue, keepSuggestionsFromCount) {
  const inputValue = input.trim()
    .toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  let countToStartOfActivePage = -1;

  return inputLength < 0
    ? []
    : suggestions.filter((suggestion) => {
      let keep;
      const filter = filterValue.toString();
      const claimStatus = suggestion.claimStatus.toString();
      let matched = false;

      if (searchBy === ORDER_NUMBER) {
          matched = suggestion.orderNumber.toString().slice(0, input.length).toLowerCase() === input && (claimStatus === filter || filter === FILTER_ALL);
          if (matched){
              countToStartOfActivePage += 1;
              if (countToStartOfActivePage >= keepSuggestionsFromCount){
                  keep = count < 10
                      && ((claimStatus === filter) || filter === FILTER_ALL);
              }else{
                  keep = false;
              }
          }
          else{
              keep = false;
          }
      } else {
          matched = suggestion.customer.name.toLowerCase().includes(input.toLowerCase()) && (claimStatus === filter || filter === FILTER_ALL);
          if (matched){
              countToStartOfActivePage += 1;
              if (countToStartOfActivePage >= keepSuggestionsFromCount){
                  keep = count < 10
                      && ((claimStatus === filter) || filter === FILTER_ALL);
              }else{
                  keep = false;
              }
          }
          else{
              keep = false;
          }
      }
      if (keep) {
        count += 1;
      }
      return keep;
    });
}
