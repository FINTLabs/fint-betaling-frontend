import React from 'react';
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";
import {useDispatch, useSelector} from "react-redux";
import deburr from "lodash/deburr";
import TextField from "@material-ui/core/TextField";
import {Box, makeStyles} from "@material-ui/core";
import ProductTable from "./product_table";
import {updateProductSearchValue, updateProductSuggestions} from "../../../../data/redux/actions/payment";

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
        flex: "0 0 25em",
    },
}));

const ProductSearch = () => {

    const searchValue = useSelector(state => state.payment.product.searchValue);
    const dispatch = useDispatch();
    const filteredSuggestions = useSelector(state => state.payment.product.filteredSuggestions);
    const suggestions = useSelector(state => state.orderLines.orderLines);
    const searchLabel = "Søk";
    const classes = useStyles();
    const searchPlaceHolder = "Produkt";

    console.log("Sugg: ", suggestions, filteredSuggestions);
    console.log("SearchValue: ", searchValue);


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
            keep = count < 10 && (
                suggestion.navn.slice(0, input.length).toLowerCase() === input ||
                suggestion.kode.slice(0, input.length).toLowerCase() === input
            );
            if (keep) {
                count += 1;
            }
            return keep;
        });
    }

    function renderSuggestion(suggestion, {query, isHighlighted}) {
    }

    function getSuggestionValue(suggestion) {
        return suggestion.navn;
    }


    const handleSuggestionsFetchRequested = ({value}) => {
        dispatch(updateProductSuggestions(getSuggestions(value)));
    };

    const handleSuggestionsClearRequested = () => {
        if (searchValue < 1) {
            dispatch(updateProductSuggestions(suggestions));
        }
    };

    function handleSearchValue(event) {
        dispatch(updateProductSearchValue(event.target.value));
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
            <ProductTable className={classes.recipientSuggestItem}/>
        </Box>
    );
};

export default ProductSearch;