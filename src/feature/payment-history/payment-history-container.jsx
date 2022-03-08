import React from 'react';
// import FormControl from '@material-ui/core/FormControl';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
// import { CUSTOMER_NAME, ORDER_NUMBER } from '../payment/constants';
import PaymentSearch from './payment-search';
import {
    updateNeedFetch,
// updatePaymentsSearchBy,
// updatePaymentsSearchValue
} from '../../data/redux/actions/payment';
// import fetchPayments from '../../data/redux/actions/payments';
// import FilterSelect from './filter-selection';

const PaymentHistoryContainer = () => {
    const searchBy = useSelector((state) => state.payment.payments.searchBy);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const dispatch = useDispatch();

    if (needsFetch) {
        // dispatch(fetchPayments());
        dispatch(updateNeedFetch(false));
    }

    /*
     const handleSearchBy = (event) => {
        dispatch(updatePaymentsSearchBy(event.target.value));
        dispatch(updatePaymentsSearchValue(''));
    }; */

    return (
        <Box minWidth="80%" mt={4}>
            <Box
                bgcolor="grey.200"
                borderRadius={1}
                p={2}
            >
                <Box m={1}>
                    <Typography variant="h5">
                        Ordre historikk
                    </Typography>
                </Box>
                <Box m={1}>
                    <Typography variant="body1">
                        Søk på skole eller dato i feltet under. Du kan også sorter og
                        filtrer ved å klikke på overskriftene. @
                        {searchBy}
                    </Typography>
                </Box>
                <Box m={1}>
                    {/* <Typography variant="body2">
                        Oversikten viser kun ordrer du har opprettet
                    </Typography> */}
                </Box>
            </Box>

            <PaymentSearch />

        </Box>
    );
};

export default PaymentHistoryContainer;
