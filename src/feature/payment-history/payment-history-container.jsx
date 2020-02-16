import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER_NAME, ORDER_NUMBER } from '../payment/constants';
import PaymentSearch from './payment-search';
import { updateNeedFetch, updatePaymentsSearchBy, updatePaymentsSearchValue } from '../../data/redux/actions/payment';
import fetchPayment from '../../data/redux/actions/payments';
import FilterSelect from './filter-selection';

const PaymentHistoryContainer = () => {
    const searchBy = useSelector((state) => state.payment.payments.searchBy);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const dispatch = useDispatch();

    if (needsFetch) {
        dispatch(fetchPayment());
        dispatch(updateNeedFetch(false));
    }

    function handleSearchBy(event) {
        dispatch(updatePaymentsSearchBy(event.target.value));
        dispatch(updatePaymentsSearchValue(''));
    }

    return (
        <Box minWidth="50%" m={1}>
            <Box display="flex" justifyContent="center" mt={3}>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="recipientType"
                        name="recipientType"
                        value={searchBy}
                        onChange={handleSearchBy}
                    >
                        <FormControlLabel value={ORDER_NUMBER.toString()} control={<Radio />} label="Ordrenummer" />
                        <FormControlLabel value={CUSTOMER_NAME.toString()} control={<Radio />} label="Navn" />
                    </RadioGroup>
                    <FilterSelect />
                </FormControl>
            </Box>
            <PaymentSearch />

        </Box>
    );
};

export default PaymentHistoryContainer;
