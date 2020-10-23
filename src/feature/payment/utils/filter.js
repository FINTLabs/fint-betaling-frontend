import {FILTER_ALL, ORDER_NUMBER} from '../constants';
import _ from 'lodash';

export default function filterSuggestions(input, suggestions, searchBy, filterValue, searchOnlyMe, me, selectedDate,
                                          dateChecked, keepSuggestionsFromCount) {
    const inputValue = input.trim()
        .toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    let countToStartOfActivePage = -1;

    return inputLength < 0
        ? []
        : suggestions.filter((suggestion) => {
            if (!searchOnlyMe) {
                return true;
            } else return _.isEqual(suggestion.createdBy, me);
        }).filter((suggestion) => {

            if (dateChecked) {
                const year = selectedDate.getFullYear();
                const month = (selectedDate.getMonth() + 1) < 10 ? "0" + (selectedDate.getMonth() + 1) : selectedDate.getMonth() + 1;
                const day = selectedDate.getDate() < 10 ? "0" + selectedDate.getDate() : selectedDate.getDate();
                return suggestion.createdDate === year + "-" + month + "-" + day;
            } else return true;
        })
            .filter((suggestion) => {
                let keep;
                const filter = filterValue.toString();
                const claimStatus = suggestion.claimStatus.toString();
                let matched = false;

                if (searchBy === ORDER_NUMBER) {
                    matched = suggestion.orderNumber.toString().slice(0, input.length).toLowerCase() === input && (claimStatus === filter || filter === FILTER_ALL);
                    if (matched) {
                        countToStartOfActivePage += 1;
                        if (countToStartOfActivePage >= keepSuggestionsFromCount) {
                            keep = count < 10
                                && ((claimStatus === filter) || filter === FILTER_ALL);
                        } else {
                            keep = false;
                        }
                    } else {
                        keep = false;
                    }
                } else {
                    matched = suggestion.customer.name.toLowerCase().includes(input.toLowerCase()) && (claimStatus === filter || filter === FILTER_ALL);
                    if (matched) {
                        countToStartOfActivePage += 1;
                        if (countToStartOfActivePage >= keepSuggestionsFromCount) {
                            keep = count < 10
                                && ((claimStatus === filter) || filter === FILTER_ALL);
                        } else {
                            keep = false;
                        }
                    } else {
                        keep = false;
                    }
                }
                if (keep) {
                    count += 1;
                }
                return keep;
            });
}
