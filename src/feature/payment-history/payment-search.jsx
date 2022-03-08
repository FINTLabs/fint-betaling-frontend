import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import {
    // updatePaymentsSearchValue,
    updatePaymentsSuggestions,
    updateSuggestionLength,
} from '../../data/redux/actions/payment';
import { FILTER_ALL, ORDER_NUMBER, SEARCH_PAGE_ROWS } from '../payment/constants';
import filterSuggestions from '../payment/utils/filter';
import PaymentsDataGrid from './payments-data-grid';

const PaymentSearch = () => {
    const dispatch = useDispatch();

    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.payments.searchValue);
    const searchBy = useSelector((state) => state.payment.payments.searchBy)
        .toString();
    const filterValue = useSelector((state) => state.payment.payments.filter)
        .toString();
    const suggestions = payments;
    // const searchPlaceHolder = searchBy === ORDER_NUMBER ? 'Ordrenummer' : 'Fakturamottaker';
    const activePage = useSelector((state) => state.payment.form.page);
    const rowsPerPage = SEARCH_PAGE_ROWS;

    const matchedPayment = (suggestion, input) => {
        if (input.length > 0) {
            return searchBy === ORDER_NUMBER
                ? suggestion.orderNumber.includes(input)
                : suggestion.customer.name.indexOf(input);
        }
        return false;
    };

    const getPaymentsLength = (input) => {
        const array = [];
        suggestions.filter((suggestion) => {
            if (matchedPayment(suggestion, input)
                && (filterValue === suggestion.claimStatus || filterValue === FILTER_ALL)) {
                array.push(suggestion);
            }
            return null;
        });
        return array.length;
    };

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

    /* const handleSearchValue = (event) => {
        dispatch(updateSuggestionLength(getPaymentsLength(event.target.value)));
        dispatch(updatePaymentsSearchValue(event.target.value));
        dispatch(updatePaymentsSuggestions(filterSuggestions(event.target.value,
            suggestions,
            searchBy,
            filterValue,
            activePage * rowsPerPage)));
    }; */

    return (
        <Box width={1}>
            <PaymentsDataGrid />
        </Box>
    );
};

export default PaymentSearch;
