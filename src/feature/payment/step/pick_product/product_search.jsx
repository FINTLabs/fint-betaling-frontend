import React, {useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Autosuggest from 'react-autosuggest';
import {useDispatch, useSelector} from 'react-redux';
import deburr from 'lodash/deburr';
import TextField from '@material-ui/core/TextField';
import {Box, makeStyles} from '@material-ui/core';
import ProductTable from './product_table';
import {
    updateProductLength,
    updateProductSearchValue,
    updateProductSuggestions,
    updateSearchPage,
} from '../../../../data/redux/actions/payment';
import {SEARCH_PAGE_ROWS, SEARCH_PAGE_START} from '../../constants';

const useStyles = makeStyles((theme) => ({

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
        flex: '1',
        overflow: 'auto',
    },
    recipientSuggestItem: {
        flex: '0 0 25em',
    },
}));

const ProductSearch = () => {
    const searchValue = useSelector((state) => state.payment.product.searchValue);
    const dispatch = useDispatch();
    const filteredSuggestions = useSelector((state) => state.payment.product.filteredSuggestions);
    const suggestions = useSelector((state) => state.orderLines.orderLines);
    const activePage = useSelector((state) => state.payment.form.page);
    const productsLengthTemp = useSelector((state) => state.payment.product.productsLength);
    const productsLength = searchValue.length === 0 ? 0 : productsLengthTemp;
    const searchLabel = 'Søk';
    const classes = useStyles();
    const searchPlaceHolder = 'Produktnavn eller produktkode';
    const rowsPerPage = SEARCH_PAGE_ROWS;

    useEffect(() => {
        dispatch(updateProductLength(getProductsLength(searchValue)));
        dispatch(updateProductSuggestions(getSuggestions(searchValue)));
    }, [activePage, searchValue]);

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
            const matched = matchedProduct(suggestion, input);
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

    function matchedProduct(suggestion, input) {
        if (input.length > 0) {
            return (
                suggestion.navn.slice(0, input.length)
                    .toLowerCase() === input
                || suggestion.kode.slice(0, input.length)
                    .toLowerCase() === input
            );
        }
        return false;
    }

    function getProductsLength(input) {
        return suggestions.filter(suggestion => matchedProduct(suggestion, input)).length;
    }


    function renderSuggestion(suggestion, {query, isHighlighted}) {
    }

    function getSuggestionValue(suggestion) {
        return suggestion.name;
    }

    const handleSuggestionsFetchRequested = ({value}) => {
        dispatch(updateProductLength(getProductsLength(value)));
        dispatch(updateProductSuggestions(getSuggestions(value)));
    };

    const handleSuggestionsClearRequested = () => {
        if (searchValue < 1) {
            dispatch(updateSearchPage(SEARCH_PAGE_START));
            dispatch(updateProductSuggestions(suggestions));
        }
    };

    function handleSearchValue(event) {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
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
            {productsLength > 0 ? <ProductTable className={classes.recipientSuggestItem}/> : <div/>}
        </Box>
    );
};

export default ProductSearch;
