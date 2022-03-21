import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OrderChipList from './order-chip-list';
import ClaimRepository from '../../../data/repository/ClaimRepository';
import fetchPayments from '../../../data/redux/actions/payments';
import {
    updateLatestSentPayment,
    updateLoadingSendingInvoice,
    updateNeedFetch,
    updateOrderSearchValue,
    updateRedirectFromExternal,
    updateSelectedOrders,
    updateSendOrderResponse,
} from '../../../data/redux/actions/payment';
import SearchField from '../../../common/search-field';
import SendToInvoiceTable from './send-to-invoice-table';
import fetchPaymentsStatusCountUnsendt from '../../../data/redux/actions/status';

const SendToInvoiceContainer = () => {
    const dispatch = useDispatch();

    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.sendToExternalSystem.searchValue);
    const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const me = useSelector((state) => state.me.me);
    const suggestions = payments.filter((payment) => payment.claimStatus === 'STORED'
        && payment.createdBy.name === me.name);
    const filteredSuggestions = suggestions.filter((s) => s.orderNumber.includes(searchValue));

    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };
    // TODO We need to get this from the me object
    const orgId = 'fintlabs.no';

    if (needsFetch) {
        dispatch(fetchPayments());
        dispatch(updateNeedFetch(false));
    }

    const handleSearchValue = (event) => {
        dispatch(updateOrderSearchValue(event.target.value));
    };

    const clearSearchValue = () => {
        dispatch(updateOrderSearchValue(''));
        dispatch(updateLatestSentPayment({}));
        dispatch(updateSelectedOrders([]));
    };

    const handleConfirmSendPayments = () => {
        ClaimRepository.sendOrders(
            orgId,
            Object.keys(selectedOrders)
                .filter((key) => selectedOrders[key].checked),
        )
            .then(([response, data]) => {
                console.log('response', response);
                if (response.status === 201) {
                    dispatch(updateSendOrderResponse(data));
                    dispatch(updateOrderSearchValue(1));
                    dispatch(updateRedirectFromExternal(true));
                    dispatch(updateLoadingSendingInvoice(false));
                    dispatch(updateNeedFetch(true));
                    dispatch(fetchPaymentsStatusCountUnsendt('STORED'));
                    dispatch(updateLatestSentPayment({}));

                    setShowSnackbar(true);
                    setSnackbarMessage(`${data.length} ordre er sendt til økonomisystemet!`);
                } else {
                    setShowSnackbar(true);
                    setSnackbarMessage(`En feil oppstod ved sending til økonomisystemet!
                     (Response status: ${response.status})`);
                }
            })
            .catch((error) => {
                setShowSnackbar(true);
                setSnackbarMessage(`En feil oppstod ved sending til økonomisystemet! (Error: ${error})`);
            });
        dispatch(updateLoadingSendingInvoice(true));
        clearSearchValue();
    };

    return (
        <Box width="80%" alignSelf="center" mt={4}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleClose}
                message={snackbarMessage}
                action={(
                    <>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            />
            <Box
                bgcolor="grey.200"
                borderRadius={1}
                p={2}
            >
                <Box m={1}>
                    <Typography variant="h5">
                        Ordre som ikke er sendt til fakturering
                    </Typography>
                </Box>
                <Box m={1}>
                    <Typography variant="body1">
                        Søk på ordrenummer i feltet under
                    </Typography>
                </Box>
                <Box m={1}>
                    <Typography variant="body2">
                        Oversikten viser kun ordrer du har opprettet
                    </Typography>
                </Box>
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
            <Box display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleConfirmSendPayments}
                    disabled={Object.keys(selectedOrders)
                        .filter((key) => selectedOrders[key].checked).length < 1}
                >
                    Send ordre til fakturering
                </Button>
            </Box>

            <SendToInvoiceTable filteredSuggestions={filteredSuggestions} selectedOrders={selectedOrders} />
        </Box>
    );
};

export default SendToInvoiceContainer;
