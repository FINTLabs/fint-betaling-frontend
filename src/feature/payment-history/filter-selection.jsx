import React from 'react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import {
    updatePaymentFilterValue,
    updatePaymentsSuggestions,
    updateSearchPage,
    updateSuggestionLength,
} from '../../data/redux/actions/payment';
import {
    FILTER_ALL, FILTER_LIST, ORDER_NUMBER, SEARCH_PAGE_ROWS, SEARCH_PAGE_START,
} from '../payment/constants';
import filterSuggestions from '../payment/utils/filter';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const FilterSelect = () => {
    const classes = useStyles();
    const activePage = useSelector((state) => state.payment.form.page);
    const rowsPerPage = SEARCH_PAGE_ROWS;
    const filterValue = useSelector((state) => state.payment.payments.filter);
    const payments = useSelector((state) => state.payments.payments);
    const searchBy = useSelector((state) => state.payment.payments.searchBy)
        .toString();
    const searchValue = useSelector((state) => state.payment.payments.searchValue);
    const dispatch = useDispatch();

    function matchedPayment(suggestion, input) {
        if (input.length > 0) {
            return searchBy === ORDER_NUMBER
                ? suggestion.orderNumber.includes(input)
                : suggestion.customer.name.includes(input);
        }
        return false;
    }

    function getPaymentsLength(input, filter) {
        const array = [];
        payments.filter((suggestion) => {
            if (matchedPayment(suggestion, input)
                && (filter === suggestion.claimStatus || filter === FILTER_ALL)) {
                array.push(suggestion);
            }
            return null;
        });
        return array.length;
    }

    const handleChange = (event) => {
        dispatch(updatePaymentFilterValue(event.target.value));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateSuggestionLength(getPaymentsLength(searchValue, event.target.value)));
        dispatch(updatePaymentsSuggestions(filterSuggestions(
            searchValue,
            payments,
            searchBy,
            event.target.value,
            activePage * rowsPerPage,
        )));
    };

    return (
        <Box>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="filter-simple">Filtrer på status</InputLabel>
                <Select
                    value={filterValue}
                    onChange={handleChange}
                    inputProps={{
                        name: 'Filter',
                        id: 'filter-simple',
                    }}
                >
                    {FILTER_LIST.map(
                        (filter) => (
                            <MenuItem key={filter.key} value={filter.key}>
                                {filter.label}
                            </MenuItem>
                        ),
                    )}
                </Select>
            </FormControl>
        </Box>
    );
};

export default FilterSelect;
