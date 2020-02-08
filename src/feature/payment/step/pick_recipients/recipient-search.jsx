import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import {
    updateSearchPage,
    updateSearchValue,
    updateSuggestionLength,
    updateSuggestions,
} from '../../../../data/redux/actions/payment';
import { GROUP, SEARCH_PAGE_ROWS, SEARCH_PAGE_START } from '../../constants';
import RecipientSuggestItem from './recipient-suggest-item';

const RecipientSearch = () => {
    const searchValue = useSelector((state) => state.payment.form.searchValue);
    const recipientType = useSelector((state) => state.payment.form.searchBy)
        .toString();
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const splitCustomers = useSelector((state) => state.customers.namesSplit);
    const activePage = useSelector((state) => state.payment.form.page);
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const suggestionsLength = searchValue.length === 0 ? 0 : suggestionLengthTemp;
    const rowsPerPage = SEARCH_PAGE_ROWS;
    const suggestions = recipientType === GROUP ? groups : individual;
    const searchPlaceHolder = recipientType === GROUP ? 'Gruppenavn' : 'Etternavn, Fornavn Mellomnavn';


    function matchedSuggestion(suggestion, input) {
        if (input.length > 0) {
            if (recipientType === GROUP) {
                return suggestion.name.slice(0, input.length)
                    .toLowerCase() === input;
            }
            if (suggestion.name.slice(0, input.length)
                .toLowerCase() === input) {
                return true;
            }
            for (let i = 0; i < splitCustomers[suggestion.id].length; i++) {
                if (splitCustomers[suggestion.id][i].slice(0, input.length)
                    .toLowerCase() === input) {
                    return true;
                }
            }
        }
        return false;
    }

    function filterSuggestions(input) {
        let countSuggestion = 0;
        let countToStartOfActivePage = -1;
        const keepSuggestionsFromCount = activePage * rowsPerPage;

        return suggestions.filter((suggestion) => {
            const matched = matchedSuggestion(suggestion, input);
            if (matched) {
                countToStartOfActivePage += 1;
            }
            const keep = countSuggestion < rowsPerPage
                && keepSuggestionsFromCount <= countToStartOfActivePage
                && matched;
            if (keep && keepSuggestionsFromCount <= countToStartOfActivePage) {
                countSuggestion += 1;
            }
            return keep;
        });
    }

    function getSuggestions(value) {
        const inputValue = value.trim()
            .toLowerCase();
        const inputLength = inputValue.length;

        return inputLength < 0
            ? []
            : filterSuggestions(inputValue);
    }


    function getSuggestionsLength(input) {
        let count = 0;
        suggestions.filter((suggestion) => matchedSuggestion(suggestion, input))
            .map(() => {
                count += 1;
                return null;
            });
        return count;
    }

    useEffect(() => {
        dispatch(updateSuggestionLength(getSuggestionsLength(searchValue)));
        dispatch(updateSuggestions(getSuggestions(searchValue)));
    }, [activePage, searchValue]);


    function handleSearchValue(event) {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateSearchValue(event.target.value));
    }

    return (
        <Box>
            <TextField
                onChange={handleSearchValue}
                variant="outlined"
                fullWidth
                autoFocus
                id="recipient-search-field"
                label={`Søk på ${searchPlaceHolder.toLowerCase()}`}
                value={searchValue}
            />
            {suggestionsLength > 0 ? <Box mt={2}><RecipientSuggestItem /></Box> : <div />}
        </Box>
    );
};

export default RecipientSearch;
