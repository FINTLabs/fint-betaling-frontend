import React, {useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {Box, makeStyles} from '@material-ui/core';
import {
    updateSearchPage,
    updateSearchValue,
    updateSuggestionLength,
    updateSuggestions,
} from '../../../../data/redux/actions/payment';
import {GROUP, SEARCH_PAGE_ROWS, SEARCH_PAGE_START} from '../../constants';
import RecipientSuggestItem from './recipient_suggest_item';

const useStyles = makeStyles((theme) => ({

    searchField: {width: "100%"},
    root: {
        flex: "1",
        '& .MuiInput-underline:after': {
            content: "none"
        },
        '& .MuiInput-underline:before': {
            content: "none"
        },
    },
    containerSuggestions: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing(2),
    },
    container: {
        flex: '1',
        width: "50%",
    },
    recipientSuggestItem: {
        flexBasis: '40%',
    },
}));

const RecipientSearch = () => {
    const searchValue = useSelector((state) => state.payment.form.searchValue);
    const recipientType = useSelector((state) => state.payment.form.searchBy)
        .toString();
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const splitCustomers = useSelector(state => state.customers.namesSplit);
    const activePage = useSelector((state) => state.payment.form.page);
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const suggestionsLength = searchValue.length === 0 ? 0 : suggestionLengthTemp;
    const rowsPerPage = SEARCH_PAGE_ROWS;
    let suggestions = recipientType === GROUP ? groups : individual;
    const classes = useStyles();
    const searchPlaceHolder = recipientType === GROUP ? 'Gruppenavn' : 'Etternavn, Fornavn Mellomnavn';

    useEffect(() => {
        dispatch(updateSuggestionLength(getSuggestionsLength(searchValue)));
        dispatch(updateSuggestions(getSuggestions(searchValue)));
    }, [activePage, searchValue,]);

    function getSuggestions(value) {
        const inputValue = value.trim()
            .toLowerCase();
        const inputLength = inputValue.length;

        return inputLength < 0
            ? []
            : filterSuggestions(inputValue);
    }

    function filterSuggestions(input) {
        let countSuggestion = 0;
        let countToStartOfActivePage = -1;
        const keepSuggestionsFromCount = activePage * rowsPerPage;

        return suggestions.filter((suggestion) => {
            let keep;
            const matched = matchedSuggestion(suggestion, input);
            if (matched) {
                countToStartOfActivePage += 1;
            }
            keep = countSuggestion < rowsPerPage
                && keepSuggestionsFromCount <= countToStartOfActivePage
                && matched;
            if (keep && keepSuggestionsFromCount <= countToStartOfActivePage) {
                countSuggestion += 1;
            }
            return keep;
        });
    }

    function matchedSuggestion(suggestion, input) {
        if (input.length > 0) {
            if (recipientType === GROUP) {
                return suggestion.name.slice(0, input.length)
                    .toLowerCase() === input;
            }
            if (suggestion.name.slice(0, input.length).toLowerCase() === input) {
                return true;
            }
            for (let i = 0; i < splitCustomers[suggestion.id].length; i++) {
                if (splitCustomers[suggestion.id][i].slice(0, input.length).toLowerCase() === input) {
                    return true;
                }
            }
        }
        return false;
    }

    function getSuggestionsLength(input) {
        let count = 0;
        suggestions.filter(suggestion => matchedSuggestion(suggestion, input)).map(() => {
            count += 1;
            return null;
        });
        return count;
    }

    function handleSearchValue(event) {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateSearchValue(event.target.value));
    }

    return (
        <Box className={classes.root}>
            <Paper className={classes.container}>
                <TextField
                    className={classes.searchField}
                    inputProps={{
                        classes,
                        id: 'recipient-search-field',
                        placeholder: `Søk på ${searchPlaceHolder.toLowerCase()}`,
                        value: searchValue,
                        onChange: handleSearchValue,
                    }}
                    theme={{
                        container: classes.containerSuggestions,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                        input: {
                            marginLeft: '8px',
                        },
                    }}
                />
            </Paper>
            {suggestionsLength > 0 ? <RecipientSuggestItem className={classes.recipientSuggestItem}/> : <div/>}
        </Box>
    );
};

export default RecipientSearch;
