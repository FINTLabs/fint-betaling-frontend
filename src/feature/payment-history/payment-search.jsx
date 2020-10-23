import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box} from '@material-ui/core';
import PaymentsTable from './payments-table';
import {
    updatePaymentsSearchValue,
    updatePaymentsSuggestions,
    updateSuggestionLength,
} from '../../data/redux/actions/payment';
import {FILTER_ALL, ORDER_NUMBER, SEARCH_PAGE_ROWS} from '../payment/constants';
import filterSuggestions from '../payment/utils/filter';
import SearchField from '../../common/search-field';
import _ from "lodash";


const PaymentSearch = (props) => {
    const {selectedDate, dateChecked} = props;
    console.log(selectedDate);
    const dispatch = useDispatch();

    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.payments.searchValue);
    const searchBy = useSelector((state) => state.payment.payments.searchBy)
        .toString();
    const me = useSelector((state) => state.me.me);
    const filterValue = useSelector((state) => state.payment.payments.filter)
        .toString();
    const searchOnlyMe = useSelector((state) => state.payment.payments.searchOnlyMe);
    const suggestions = payments;
    const searchPlaceHolder = searchBy === ORDER_NUMBER ? 'Ordrenummer' : 'Fakturamottaker';
    const activePage = useSelector((state) => state.payment.form.page);
    const rowsPerPage = SEARCH_PAGE_ROWS;

    function matchedPayment(suggestion, input) {
        if (input.length > 0) {
            return searchBy === ORDER_NUMBER
                ? suggestion.orderNumber.toString().slice(0, input.length).toLowerCase() === input
                : suggestion.customer.toString().slice(0, input.length).toLowerCase() === input;
        }
        return false;
    }

    function getPaymentsLength(input) {
        const array = [];
        suggestions.forEach((suggestion) => {
            if (matchedPayment(suggestion, input)
                && (filterValue === suggestion.claimStatus || filterValue === FILTER_ALL)) {
                if (!searchOnlyMe) {
                    if (dateChecked){
                        const year = selectedDate.getFullYear();
                        const month = (selectedDate.getMonth()+1) <10 ? "0"+(selectedDate.getMonth()+1) : selectedDate.getMonth()+1;
                        const day = selectedDate.getDate()< 10 ? "0"+selectedDate.getDate() : selectedDate.getDate();
                        if (suggestion.createdDate === year+"-"+month+"-"+day){array.push(suggestion);};
                    }else{array.push(suggestion)}
                } else if (_.isEqual(suggestion.createdBy, me)) {
                    array.push(suggestion)
                }
            }
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
            searchOnlyMe,
            me,
            selectedDate,
            dateChecked,
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
            searchOnlyMe,
            me,
            selectedDate,
            dateChecked,
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

            <PaymentsTable/>

        </Box>
    );
};

export default PaymentSearch;
