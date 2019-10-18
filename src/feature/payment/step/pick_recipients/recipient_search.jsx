import React, {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";
import {
    updateSearchPage,
    updateSearchValue,
    updateSuggestionLength,
    updateSuggestions
} from "../../../../data/redux/actions/payment";
import {useDispatch, useSelector} from "react-redux";
import deburr from "lodash/deburr";
import TextField from "@material-ui/core/TextField";
import {Box, makeStyles} from "@material-ui/core";
import {GROUP, SEARCH_PAGE_ROWS_AMONT, SEARCH_PAGE_START} from "../../constants";
import RecipientSuggestItem from "./recipient_suggest_item";

const useStyles = makeStyles(theme => ({

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
        flex: "1",
        overflow: "auto",
    },
    recipientSuggestItem: {
        flexBasis: "40%",
    },
}));

const RecipientSearch = () => {

    const searchValue = useSelector(state => state.payment.form.searchValue);
    const recipientType = useSelector(state => state.payment.form.searchBy).toString();
    const dispatch = useDispatch();
    const filteredSuggestions = useSelector(state => state.payment.form.filteredSuggestions);
    const groups = useSelector(state => state.groups.groups);
    const individual = useSelector(state => state.customers.customers);
    const activePage = useSelector(state => state.payment.form.page);
    const rowsPerPage = SEARCH_PAGE_ROWS_AMONT;
    const suggestions = recipientType === GROUP ? groups : individual;
    const searchLabel = "Søk";
    const classes = useStyles();
    const searchPlaceHolder = recipientType === GROUP ? "Gruppenavn" : "Navn";

    useEffect(() => {
        handleSuggestionsFetchRequested({value: searchValue});
    }, [activePage]);

    function renderInputComponent(inputProps) {
        const {
            classes, inputRef = () => {
            }, ref, ...other
        } = inputProps;

        return (
            <TextField
                fullWidth
                InputProps={{
                    inputRef: node => {
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

    function getSuggestions(value, page) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;

        return inputLength < 0
            ? []
            : filterSuggestions(inputValue);
    }

    function filterSuggestions(input) {
        let countSuggestion = 0;
        let countToStartOfActivePage = -1;
        const keepSuggestionsFromCount = activePage * rowsPerPage;

        return suggestions.filter(suggestion => {
            let keep;
            let matched = matchedSuggestion(suggestion, input);
            if (matched) {
                countToStartOfActivePage += 1;
            }
            keep =
                countSuggestion < rowsPerPage &&
                keepSuggestionsFromCount <= countToStartOfActivePage &&
                matched;
            if (keep && keepSuggestionsFromCount <= countToStartOfActivePage) {
                countSuggestion += 1;
            }
            return keep;

        });
    }

    function matchedSuggestion(suggestion, input) {
        if (recipientType === GROUP) {
            return suggestion.navn.slice(0, input.length).toLowerCase() === input
        } else {
            return (
                (suggestion.fulltNavn && suggestion.fulltNavn.slice(0, input.length).toLowerCase() === input) ||
                (suggestion.navn.fornavn && suggestion.navn.fornavn.slice(0, input.length).toLowerCase() === input) ||
                (suggestion.navn.mellomnavn && suggestion.navn.mellomnavn.slice(0, input.length).toLowerCase() === input) ||
                (suggestion.navn.etternavn && suggestion.navn.etternavn.slice(0, input.length).toLowerCase() === input)
            )
        }
    }

    function getSuggestionsLength(input) {
        let count = 0;
        suggestions.map(suggestion => {
            if (matchedSuggestion(suggestion, input)) {
                count += 1;
            }
        });
        return count;
    }

    function renderSuggestion(suggestion, {query, isHighlighted}) {
    }

    function getSuggestionValue(suggestion) {
        return recipientType === GROUP ? suggestion.navn : suggestion.fulltNavn;
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
            <RecipientSuggestItem className={classes.recipientSuggestItem}/>
        </Box>
    );
};

export default RecipientSearch;