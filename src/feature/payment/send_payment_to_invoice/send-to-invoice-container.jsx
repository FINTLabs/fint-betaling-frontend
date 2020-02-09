import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import OrderChipList from './order-chip-list';
import ClaimRepository from '../../../data/repository/ClaimRepository';
import fetchPayment from '../../../data/redux/actions/payments';
import {
    updateLoadingSendingInvoice,
    updateNeedFetch,
    updateOrderSearchValue,
    updateRedirectFromExternal,
    updateSendOrderResponse,
    updateSentPayment,
} from '../../../data/redux/actions/payment';
import SearchField from '../../../common/search-field';
import SendToInvoiceTable from './send-to-invoice-table';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        alignSelf: 'center',
        margin: 'auto',
        '& .MuiInput-underline:after': {
            content: 'none',
        },
        '& .MuiInput-underline:before': {
            content: 'none',
        },
    },
    h1: {
        margin: theme.spacing(1),
    },
    h2: {
        margin: theme.spacing(1),
    },
}));

const SendToInvoiceContainer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.sendToExternalSystem.searchValue);
    const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const me = useSelector((state) => state.me.me);
    const suggestions = payments.filter((payment) => payment.claimStatus === 'STORED'
        && payment.createdBy.name === me.name);
    const filteredSuggestions = suggestions.filter((s) => s.orderNumber.includes(searchValue));

    // TODO We need to get this from the me object
    const orgId = 'fintlabs.no';

    if (needsFetch) {
        dispatch(fetchPayment());
        dispatch(updateNeedFetch(false));
    }


    function handleSearchValue(event) {
        dispatch(updateOrderSearchValue(event.target.value));
        dispatch(updateSentPayment({}));
    }

    function clearSearchValue() {
        dispatch(updateOrderSearchValue(''));
        dispatch(updateSentPayment({}));
    }

    function handleConfirmSendPayments() {
        ClaimRepository.sendOrders(
            orgId,
            Object.keys(selectedOrders)
                .filter((key) => selectedOrders[key].checked),
        )
            .then((data) => {
                dispatch(updateSendOrderResponse(data));
                dispatch(updateOrderSearchValue(1));
                dispatch(updateRedirectFromExternal(true));
                dispatch(updateLoadingSendingInvoice(false));
                dispatch(updateNeedFetch(true));
                dispatch(updateSentPayment({}));
            });
        dispatch(updateLoadingSendingInvoice(true));
    }


    return (
        <Box className={classes.root}>
            <Box
                bgcolor="grey.200"
                borderRadius="borderRadius"
                p={2}
            >
                <Typography variant="h5" className={classes.h1}>
                    Ordre som ikke er sendt til fakturering
                </Typography>
                <Typography variant="body1" className={classes.h1}>
                    Søk på ordrenummer i feltet under
                </Typography>
                <Typography variant="body2" className={classes.h1}>
                    Oversikten viser kun ordrer du har opprettet
                </Typography>
            </Box>
            <Box width={1}>
                <SearchField
                    label="Søk etter ordrenummer"
                    onChange={handleSearchValue}
                    onClear={clearSearchValue}
                    value={searchValue}
                />
            </Box>
            <OrderChipList />
            {Object.keys(selectedOrders)
                .filter((key) => selectedOrders[key].checked).length > 0
                ? (
                    <Box display="flex" justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={handleConfirmSendPayments}>
                            Send ordre til fakturering
                        </Button>
                    </Box>
                )
                : <div />}
            <SendToInvoiceTable filteredSuggestions={filteredSuggestions} selectedOrders={selectedOrders} />
        </Box>
    );
};

export default SendToInvoiceContainer;
