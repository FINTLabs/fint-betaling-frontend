import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import PaymentsDataGrid from './payments-data-grid';
import fetchPayments from '../../data/redux/actions/payments';

const PaymentSearch = () => {
    const dispatch = useDispatch();
    const periodSelection = useSelector((state) => state.payment.payments.periodSelection);
    const schoolSelection = useSelector((state) => state.payment.payments.schoolSelection);

    useEffect(() => {
        dispatch(fetchPayments(periodSelection, schoolSelection));
    }, [dispatch]);

    return (
        <Box width={1}>
            <PaymentsDataGrid />
        </Box>
    );
};

export default PaymentSearch;
