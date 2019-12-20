import { FILTER_ALL, ORDER_NUMBER } from '../constants';

export default function filterSuggestions(input, suggestions, searchBy, filterValue) {
  const inputValue = input.trim()
    .toLowerCase();
  const inputLength = inputValue.length;

  let count = 0;

  return inputLength < 0
    ? []
    : suggestions.filter((suggestion) => {
      let keep;
      const filter = filterValue.toString();
      const claimStatus = suggestion.claimStatus.toString();
      if (searchBy === ORDER_NUMBER) {
        keep = count < 10 && suggestion.orderNumber.toString()
          .slice(0, input.length)
          .toLowerCase() === input
                && ((claimStatus === filter) || filter === FILTER_ALL);
      } else {
        const customerNameSliced = suggestion.customer.name.slice(0, input.length).toLowerCase();
        keep = (
          count < 10 && (
            (suggestion.customer.name && customerNameSliced === input
                        && ((claimStatus === filter) || filter === FILTER_ALL)
            )
          )
        );
      }
      if (keep) {
        count += 1;
      }
      return keep;
    });
}
