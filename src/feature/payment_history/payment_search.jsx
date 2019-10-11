import React from 'react';
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";
import {useDispatch, useSelector} from "react-redux";
import deburr from "lodash/deburr";
import TextField from "@material-ui/core/TextField";
import {Box, makeStyles} from "@material-ui/core";
import {GROUP, ORDER_NUMBER} from "../payment/constants";
import {updatePaymentsSearchValue, updatePaymentsSuggestions} from "../../data/redux/actions/payment";
import RecipientSuggestItem from "../payment/step/pick_recipients/recipient_suggest_item";
import PaymentsSuggestItem from "./payments_suggest_item";


const useStyles = makeStyles(theme => ({

    textField: {},
    root: {},
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

const PaymentSearch = () => {

    const payments = useSelector(state => state.payments.payments);
    const searchValue = useSelector(state => state.payment.payments.searchValue);
    const dispatch = useDispatch();
    const filteredSuggestions = useSelector(state => state.payment.payments.filteredSuggestions);
    const suggestions = payments;
    const searchBy = useSelector(state => state.payment.payments.searchBy).toString();
    const searchLabel = "Søk";
    const classes = useStyles();
    const searchPlaceHolder = searchBy === ORDER_NUMBER ? "Ordrenummer" : "fakturamottaker";

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
            if (searchBy === ORDER_NUMBER) {
                keep = count < 10 && suggestion.ordrenummer.toString().slice(0, input.length).toLowerCase() === input;
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

    function getSuggestionValue(suggestion) {
        return searchBy === ORDER_NUMBER ? suggestion.ordrenummer : suggestion.fulltNavn;
    }

    const handleSuggestionsFetchRequested = ({value}) => {
        dispatch(updatePaymentsSuggestions(getSuggestions(value)));
    };

    const handleSuggestionsClearRequested = () => {
        if (searchValue < 1) {
            dispatch(updatePaymentsSuggestions(suggestions));
        }
    };

    function handleSearchValue(event) {
        dispatch(updatePaymentsSearchValue(event.target.value));
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
            <PaymentsSuggestItem className={classes.recipientSuggestItem}/>
        </Box>
    );
};

export default PaymentSearch;