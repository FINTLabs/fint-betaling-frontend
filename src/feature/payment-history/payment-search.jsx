import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import PaymentsTable from './payments-table';
import {
    updatePaymentsSearchValue,
    updatePaymentsSuggestions,
    updateSuggestionLength,
} from '../../data/redux/actions/payment';
import { FILTER_ALL, ORDER_NUMBER, SEARCH_PAGE_ROWS } from '../payment/constants';
import filterSuggestions from '../payment/utils/filter';
import SearchField from '../../common/search-field';


const PaymentSearch = () => {
    const dispatch = useDispatch();

    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.payments.searchValue);
    const searchBy = useSelector((state) => state.payment.payments.searchBy)
        .toString();
    const filterValue = useSelector((state) => state.payment.payments.filter)
        .toString();
    const suggestions = payments;
    const searchPlaceHolder = searchBy === ORDER_NUMBER ? 'Ordrenummer' : 'Fakturamottaker';
    const activePage = useSelector((state) => state.payment.form.page);
    const rowsPerPage = SEARCH_PAGE_ROWS;

    function matchedPayment(suggestion, input) {
        if (input.length > 0) {
            return searchBy === ORDER_NUMBER
                ? suggestion.orderNumber.includes(input)
                : suggestion.customer.name.includes(input);
        }
        return false;
    }

    function getPaymentsLength(input) {
        const array = [];
        suggestions.filter((suggestion) => {
            if (matchedPayment(suggestion, input)
                && (filterValue === suggestion.claimStatus || filterValue === FILTER_ALL)) {
                array.push(suggestion);
            }
            return null;
        });
        return array.length;
    }

    const getPaymentsLengthCallback = useCallback(
        getPaymentsLength,
        [getPaymentsLength],
    );

    useEffect(() => {
        dispatch(updateSuggestionLength(getPaymentsLengthCallback(searchValue)));
        dispatch(updatePaymentsSuggestions(filterSuggestions(searchValue,
            suggestions,
            searchBy,
            filterValue,
            activePage * rowsPerPage)));
    }, [activePage,
        searchValue,
        dispatch,
        rowsPerPage,
        filterValue,
        getPaymentsLengthCallback,
        searchBy,
        suggestions]);

    function handleSearchValue(event) {
        dispatch(updateSuggestionLength(getPaymentsLength(event.target.value)));
        dispatch(updatePaymentsSearchValue(event.target.value));
        dispatch(updatePaymentsSuggestions(filterSuggestions(event.target.value,
            suggestions,
            searchBy,
            filterValue,
            activePage * rowsPerPage)));
    }


    return (
        <Box width={1}>
            <SearchField
                label={`Søk på ${searchPlaceHolder.toLowerCase()}`}
                onChange={handleSearchValue}
                onClear={() => dispatch(updatePaymentsSearchValue(''))}
                value={searchValue}
            />

            <PaymentsTable />

        </Box>
    );
};

export default PaymentSearch;
