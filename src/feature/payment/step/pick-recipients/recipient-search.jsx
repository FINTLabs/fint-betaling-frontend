import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
    updateSearchPage,
    updateSearchValue,
    updateStep,
    updateSuggestionLength,
    updateSuggestions,
} from '../../../../data/redux/actions/payment';
import {
    GROUP, SEARCH_PAGE_ROWS, SEARCH_PAGE_START, STEP_PICK_PRODUCTS,
} from '../../constants';
import RecipientSuggestItem from './recipient-suggest-item';
import SearchField from '../../../../common/search-field';

const useStyles = makeStyles((theme) => ({
    buttonForward: {
        margin: theme.spacing(1),
    },
    buttonBackward: {
        margin: theme.spacing(1),
    },
}));

const RecipientSearch = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const searchValue = useSelector((state) => state.payment.form.searchValue);
    const recipientType = useSelector((state) => state.payment.form.searchBy)
        .toString();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const splitCustomers = useSelector((state) => state.customers.namesSplit);
    const activePage = useSelector((state) => state.payment.form.page);
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const suggestionsLength = searchValue.length === 0 ? 0 : suggestionLengthTemp;
    const rowsPerPage = SEARCH_PAGE_ROWS;
    const suggestions = recipientType === GROUP ? groups : individual;
    const searchPlaceHolder = recipientType === GROUP ? 'Gruppenavn' : 'Etternavn, Fornavn Mellomnavn';

    function matchedSuggestion(suggestion, input) {
        if (input.length > 0) {
            if (recipientType === GROUP) {
                return suggestion.name.toLowerCase().includes(input.toLowerCase());
            }
            if (suggestion.name.toLowerCase().includes(input.toLowerCase())) {
                return true;
            }
            for (let i = 0; i < splitCustomers[suggestion.id].length; i += 1) {
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
            if (keep) {
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
        suggestions.filter((suggestion) => matchedSuggestion(suggestion, input.toLowerCase()))
            .map(() => {
                count += 1;
                return null;
            });
        return count;
    }

    useEffect(() => {
        dispatch(updateSuggestionLength(getSuggestionsLength(searchValue)));
        dispatch(updateSuggestions(getSuggestions(searchValue)));
    });

    const handleSearchValue = (event) => {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateSearchValue(event.target.value));
    };

    function isConfirmButtonDisabled() {
        return Object.keys(recipients)
            .filter((key) => recipients[key].checked).length === 0;
    }

    const handleConfirmButtonClick = () => {
        dispatch(updateStep(STEP_PICK_PRODUCTS));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    };

    return (
        <Box>
            <SearchField
                label={`Søk på ${searchPlaceHolder.toLowerCase()}`}
                onChange={handleSearchValue}
                onClear={() => dispatch(updateSearchValue(''))}
                value={searchValue}
            />
            <Box display="flex" justifyContent="flex-end">
                <Button
                    disabled
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                    }}
                    className={classes.buttonBackward}
                >
                    Tilbake
                </Button>
                <Button
                    disabled={isConfirmButtonDisabled()}
                    variant="contained"
                    color="secondary"
                    onClick={handleConfirmButtonClick}
                    className={classes.buttonForward}
                >
                    Videre
                </Button>
            </Box>
            {suggestionsLength > 0 ? <Box mt={2}><RecipientSuggestItem /></Box> : <div />}
        </Box>
    );
};

export default RecipientSearch;
