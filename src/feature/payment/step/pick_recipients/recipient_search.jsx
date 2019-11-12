import React, {useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Autosuggest from 'react-autosuggest';
import {useDispatch, useSelector} from 'react-redux';
import deburr from 'lodash/deburr';
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

    textField: {},
    root: {
        minWidth: 700,
        maxWidth: 700,
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
        overflow: 'auto',
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
    const filteredSuggestions = useSelector((state) => state.payment.form.filteredSuggestions);
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const splitCustomers = useSelector(state => state.customers.namesSplit);
    const activePage = useSelector((state) => state.payment.form.page);
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const suggestionsLength = searchValue.length === 0 ? 0 : suggestionLengthTemp;
    const rowsPerPage = SEARCH_PAGE_ROWS;
    const suggestions = recipientType === GROUP ? groups : individual;
    const searchLabel = 'Søk';
    const classes = useStyles();
    const searchPlaceHolder = recipientType === GROUP ? 'Gruppenavn' : 'Etternavn, Fornavn Mellomnavn';

    useEffect(() => {
        dispatch(updateSuggestionLength(getSuggestionsLength(searchValue)));
        dispatch(updateSuggestions(getSuggestions(searchValue)));
    }, [activePage, searchValue,]);

    function renderInputComponent(inputProps) {
        const {
            classes, inputRef = () => {
            }, ref, ...other
        } = inputProps;

        return (
            <TextField
                fullWidth
                InputProps={{
                    inputRef: (node) => {
                        ref(node);
                        inputRef(node);
                    },
                    classes: {
                        input: classes.input,
                    },
                }}
                {...other}
            />
        );
    }

    function getSuggestions(value) {
        const inputValue = deburr(value.trim())
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

    function renderSuggestion(suggestion, {query, isHighlighted}) {
    }

    function getSuggestionValue(suggestion) {
        return recipientType === GROUP ? suggestion.name : suggestion.name;
    }

    const handleSuggestionsFetchRequested = ({value}) => {
        dispatch(updateSuggestionLength(getSuggestionsLength(value)));
        dispatch(updateSuggestions(getSuggestions(value, activePage)));
    };

    const handleSuggestionsClearRequested = () => {
        if (searchValue < 1) {
            dispatch(updateSearchPage(SEARCH_PAGE_START));
            dispatch(updateSuggestions(suggestions));
        }
    };

    function handleSearchValue(event) {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateSearchValue(event.target.value));
    }


    return (
        <Box className={classes.root}>
            <Paper className={classes.container}>
                <Autosuggest
                    renderInputComponent={renderInputComponent}
                    getSuggestionValue={getSuggestionValue}
                    suggestions={filteredSuggestions}
                    onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={handleSuggestionsClearRequested}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        classes,
                        id: 'react-autosuggest-simple',
                        label: searchLabel,
                        placeholder: searchPlaceHolder,
                        value: searchValue,
                        onChange: handleSearchValue,
                    }}
                    theme={{
                        container: classes.containerSuggestions,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                />
            </Paper>
            {suggestionsLength > 0 ? <RecipientSuggestItem className={classes.recipientSuggestItem}/> : <div/>}
        </Box>
    );
};

export default RecipientSearch;
