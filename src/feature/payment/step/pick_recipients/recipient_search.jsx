import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";
import {updateSearchValue, updateSuggestions} from "../../../../data/redux/actions/payment";
import {useDispatch, useSelector} from "react-redux";
import deburr from "lodash/deburr";
import TextField from "@material-ui/core/TextField";
import {Box, makeStyles} from "@material-ui/core";
import {GROUP} from "../../constants";
import RecipientSuggestItem from "./recipient_suggest_item";

const useStyles = makeStyles(theme => ({

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    root: {
        height: 250,
        flexGrow: 1,
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
        margin:theme.spacing(1),
        maxWidth: 200,
    },
}));

const RecipientSearch = () => {

    const searchValue = useSelector(state => state.payment.form.searchValue);
    const recipientType = useSelector(state => state.payment.form.searchBy).toString();
    const dispatch = useDispatch();
    const filteredSuggestions = useSelector(state => state.payment.form.filteredSuggestions);
    const groups = useSelector(state=> state.groups.groups);
    const individual = useSelector(state=> state.customers.customers);
    const suggestions = recipientType === GROUP ?
        groups
        :
        individual;
    const searchLabel = "Søk";
    const classes = useStyles();
    const searchPlaceHolder = recipientType === GROUP ? "Gruppenavn" : "Navn";

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


    function getSuggestions(value) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;

        return inputLength < 0
            ? []
            : filterSuggestions(inputValue);
    }

    function filterSuggestions(input) {
        let count = 0;

        return suggestions.filter(suggestion => {
            let keep;
            if (recipientType === GROUP) {
                keep = count < 10 && suggestion.navn.slice(0, input.length).toLowerCase() === input;
            } else {
                keep = (
                    count < 10 && (
                        (suggestion.fulltNavn && suggestion.fulltNavn.slice(0, input.length).toLowerCase() === input) ||
                        (suggestion.navn.fornavn && suggestion.navn.fornavn.slice(0, input.length).toLowerCase() === input) ||
                        (suggestion.navn.mellomnavn && suggestion.navn.mellomnavn.slice(0, input.length).toLowerCase() === input) ||
                        (suggestion.navn.etternavn && suggestion.navn.etternavn.slice(0, input.length).toLowerCase() === input)
                    )
                );
            }
            if (keep) {
                count += 1;
            }
            return keep;
        });
    }

    function renderSuggestion(suggestion, {query, isHighlighted}) {
    }

    function handleAddToRecipient(event) {
        console.log("handleAddToReciptient: ", event, event.currentTarget.dataset.value);
        //dispatch(addRecipient(event.target.value));
    }

    function getSuggestionValue(suggestion) {
        return recipientType === GROUP ? suggestion.navn : suggestion.fulltNavn;
    }


    const handleSuggestionsFetchRequested = ({value}) => {
        dispatch(updateSuggestions(getSuggestions(value)));
    };

    const handleSuggestionsClearRequested = () => {
        if (searchValue < 1) {
            dispatch(updateSuggestions(suggestions));
        }
    };

    function handleSearchValue(event) {
        dispatch(updateSearchValue(event.target.value));
    }

    return (
        <Box>
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
            <RecipientSuggestItem/>
        </Box>
    );
};

export default RecipientSearch;