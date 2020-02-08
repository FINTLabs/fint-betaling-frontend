import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Box, makeStyles } from '@material-ui/core';
import ProductTable from './product_table';
import {
    updateProductLength,
    updateProductSearchValue,
    updateProductSuggestions,
    updateSearchPage,
} from '../../../../data/redux/actions/payment';
import { SEARCH_PAGE_ROWS, SEARCH_PAGE_START } from '../../constants';

const useStyles = makeStyles((theme) => ({

    searchField: { width: '100%' },
    root: {
        flex: 1,
        '& .MuiInput-underline:after': {
            content: 'none'
        },
        '& .MuiInput-underline:before': {
            content: 'none'
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
        width: '50%',
    },
    recipientSuggestItem: {
        flex: '0 0 25em',
    },
}));

const ProductSearch = () => {
    const searchValue = useSelector((state) => state.payment.product.searchValue);
    const dispatch = useDispatch();
    const suggestions = useSelector((state) => state.orderLines.orderLines);
    const activePage = useSelector((state) => state.payment.form.page);
    const productsLengthTemp = useSelector((state) => state.payment.product.productsLength);
    const productsLength = searchValue.length === 0 ? 0 : productsLengthTemp;
    const classes = useStyles();
    const searchPlaceHolder = 'Produktnavn eller produktkode';
    const rowsPerPage = SEARCH_PAGE_ROWS;

    useEffect(() => {
        dispatch(updateProductLength(getProductsLength(searchValue)));
        dispatch(updateProductSuggestions(getSuggestions(searchValue)));
    }, [activePage, searchValue]);

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
                suggestion.description.slice(0, input.length)
                    .toLowerCase() === input
                || suggestion.itemCode.slice(0, input.length)
                    .toLowerCase() === input
            );
        }
        return false;
    }

    function getProductsLength(input) {
        const array = [];
        suggestions.filter(suggestion => {
            if (matchedProduct(suggestion, input)) {
                array.push(suggestion);
            }
            return null;
        });
        return array.length;
    }

    function handleSearchValue(event) {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateProductSearchValue(event.target.value));
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
            {productsLength > 0 ? <ProductTable className={classes.recipientSuggestItem} /> : <div />}
        </Box>
    );
};

export default ProductSearch;
