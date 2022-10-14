import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import ProductTable from './product-table';
import {
    updateFailedProductForm,
    updateProductLength,
    updateProductSearchValue,
    updateProductSuggestions,
    updateSearchPage,
    updateStep,
} from '../../../../data/redux/actions/payment';
import {
    SEARCH_PAGE_ROWS, SEARCH_PAGE_START, STEP_CONFIRM_PAYMENT, STEP_PICK_RECIPIENTS,
} from '../../constants';
import SearchField from '../../../../common/search-field';

const useStyles = makeStyles((theme) => ({

    searchField: { width: '100%' },
    root: {
        flex: 1,
        '& .MuiInput-underline:after': {
            content: 'none',
        },
        '& .MuiInput-underline:before': {
            content: 'none',
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
    errorMessage: {
        color: 'red',
        marginLeft: theme.spacing(2),
        textAlign: 'center',
    },
    buttonForward: {
        margin: theme.spacing(1),
    },
    buttonBackward: {
        marginInlineStart: 'auto',
        margin: theme.spacing(1),
    },
    buttonBox: {
        display: 'flex',
        justifyContent: 'center',
    },
}));

const ProductSearch = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const failedProductForm = useSelector((state) => state.payment.product.failedProductForm);
    const pickedProducts = useSelector((state) => state.payment.payment.products);
    const productAmount = useSelector((state) => state.payment.product.amount);
    const productPrice = useSelector((state) => state.payment.product.itemPrice);
    const searchValue = useSelector((state) => state.payment.product.searchValue);
    const suggestions = useSelector((state) => state.principal.principal.lineitems);
    const activePage = useSelector((state) => state.payment.form.page);
    const productsLengthTemp = useSelector((state) => state.payment.product.productsLength);
    const productsLength = searchValue.length === 0 ? 0 : productsLengthTemp;
    const searchPlaceHolder = 'Produktnavn eller produktkode';

    function matchedProduct(suggestion, input) {
        if (input.length > 0) {
            return (
                suggestion.description.toLowerCase().includes(input.toLowerCase())
                || suggestion.itemCode.slice(0, input.length) === input
            );
        }
        return false;
    }

    function filterSuggestions(input) {
        let countSuggestion = 0;
        let countToStartOfActivePage = -1;
        const keepSuggestionsFromCount = activePage * SEARCH_PAGE_ROWS;
        return suggestions.filter((suggestion) => {
            const matched = matchedProduct(suggestion, input);
            if (matched) {
                countToStartOfActivePage += 1;
            }
            const keep = countSuggestion < SEARCH_PAGE_ROWS
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

    function getProductsLength(input) {
        const array = [];
        suggestions.filter((suggestion) => {
            if (matchedProduct(suggestion, input)) {
                array.push(suggestion);
            }
            return null;
        });
        return array.length;
    }

    const handleSearchValue = (event) => {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateProductSearchValue(event.target.value));
    };

    const getProductsLengthCallback = useCallback(getProductsLength, [getProductsLength]);
    const getSuggestionsCallback = useCallback(getSuggestions, [getSuggestions]);

    useEffect(() => {
        dispatch(updateProductLength(getProductsLengthCallback(searchValue)));
        dispatch(updateProductSuggestions(getSuggestionsCallback(searchValue)));
    }, [activePage, searchValue, getProductsLengthCallback, getSuggestionsCallback, dispatch]);

    function isConfirmButtonDisabled() {
        return Object.keys(pickedProducts)
            .filter((key) => pickedProducts[key].checked).length === 0;
    }

    const handleOnClickConfirmProducts = () => {
        let formFilledCorrect = true;
        const keys = Object.keys(pickedProducts);
        keys.filter((key) => pickedProducts[key].checked)
            .map((key) => {
                if (productAmount[key] && productPrice[key]) {
                    if (!(productPrice[key].itemPrice && productAmount[key].amount
                        && productPrice[key].itemPrice !== 0 && productAmount[key].amount.toString() !== '0')) {
                        formFilledCorrect = false;
                    }
                } else {
                    formFilledCorrect = false;
                }
                return key;
            });

        if (formFilledCorrect) {
            dispatch(updateStep(STEP_CONFIRM_PAYMENT));
        } else {
            dispatch(updateFailedProductForm(true));
        }
    };

    const handleBackwardClick = () => {
        dispatch(updateStep(STEP_PICK_RECIPIENTS));
    };

    return (
        <Box data-testid="productSearchBox">
            <SearchField
                label={`Søk på ${searchPlaceHolder.toLowerCase()}`}
                onChange={handleSearchValue}
                onClear={() => dispatch(updateProductSearchValue(''))}
                value={searchValue}
            />
            <div className={classes.buttonBox}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBackwardClick}
                    className={classes.buttonBackward}
                >
                    Tilbake
                </Button>
                <Button
                    disabled={isConfirmButtonDisabled()}
                    variant="contained"
                    color="secondary"
                    onClick={handleOnClickConfirmProducts}
                    className={classes.buttonForward}
                    data-testid="nextButtonToSummary"
                >
                    Videre
                </Button>
            </div>
            {
                failedProductForm
                && (
                    <Typography className={classes.errorMessage}>
                        Oppgi pris på produktene
                    </Typography>
                )
            }
            {productsLength > 0 ? <ProductTable className={classes.recipientSuggestItem} /> : <div />}
        </Box>
    );
};

export default ProductSearch;
