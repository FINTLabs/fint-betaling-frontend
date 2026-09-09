import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ClaimRepository, { SEND_ORDERS_BATCH_SIZE } from '../../../data/repository/ClaimRepository';
import SendingOrdersDialog from '../../../common/sending-orders-dialog';
// import fetchPayments from '../../../data/redux/actions/payments';
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
import fetchPaymentsStatusCountUnsent from '../../../data/redux/actions/status';
import fetchPayments from '../../../data/redux/actions/payments';

const SendToInvoiceContainer = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.sendToExternalSystem.searchValue);
    const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const me = useSelector((state) => state.me.me);

    const [includeMeNameFilter, setIncludeMeNameFilter] = React.useState(true);

    const suggestions = payments.filter((payment) => payment.claimStatus === 'STORED'
        && (includeMeNameFilter ? payment.createdByEmployeeNumber === me.employeeNumber : true));
    // const filteredSuggestions = suggestions.filter((s) => s.orderNumber.includes(searchValue));
    // const filteredSuggestions = suggestions;
    const filteredSuggestions = suggestions.filter((s) => s.orderNumber.toString().includes(searchValue.toString()));

    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [sendProgress, setSendProgress] = React.useState({
        currentBatch: 1,
        totalBatches: 1,
        sentCount: 0,
        totalCount: 0,
        batchSize: 0,
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };
    // TODO We need to get this from the me object
    const orgId = 'fintlabs.no';
    if (needsFetch) {
        dispatch(fetchPayments(null, null, 'STORED'));
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
        const orderNumbers = Object.keys(selectedOrders)
            .filter((key) => selectedOrders[key].checked);
        setSendProgress({
            currentBatch: 1,
            totalBatches: Math.ceil(orderNumbers.length / SEND_ORDERS_BATCH_SIZE) || 1,
            sentCount: 0,
            totalCount: orderNumbers.length,
            batchSize: Math.min(SEND_ORDERS_BATCH_SIZE, orderNumbers.length),
        });
        setOpen(true);
        ClaimRepository.sendOrders(
            orgId,
            orderNumbers,
            setSendProgress,
        ).then(({ status, data, sentCount }) => { // Destructure the response object
            if (status === 201) {
                dispatch(updateSendOrderResponse(data));
                dispatch(updateOrderSearchValue(1));
                dispatch(updateRedirectFromExternal(true));
                dispatch(updateLoadingSendingInvoice(false));
                dispatch(updateNeedFetch(true));
                dispatch(fetchPaymentsStatusCountUnsent('STORED'));
                dispatch(updateLatestSentPayment({}));

                setShowSnackbar(true);
                setSnackbarMessage(`${sentCount} ordre er sendt til økonomisystemet!`);
            } else if (sentCount > 0) {
                dispatch(updateSendOrderResponse(data));
                dispatch(updateLoadingSendingInvoice(false));
                dispatch(updateNeedFetch(true));
                dispatch(fetchPaymentsStatusCountUnsent('STORED'));
                setShowSnackbar(true);
                setSnackbarMessage(`${sentCount} ordre ble sendt, men sendingen fikk en feil
                 (Response status: ${status}). Resterende ordre kan sendes på nytt.`);
            } else {
                setShowSnackbar(true);
                setSnackbarMessage(`En feil oppstod ved sending til økonomisystemet!
                 (Response status: ${status})`);
            }
        })
            .catch((error) => {
                setShowSnackbar(true);
                setSnackbarMessage(`En feil oppstod ved sending til økonomisystemet! (Error: ${error})`);
            })
            .finally(() => {
                setOpen(false);
            });
        dispatch(updateLoadingSendingInvoice(true));
        clearSearchValue();
    };

    return (
        <Box width="80%" alignSelf="center" mt={4}>
            <SendingOrdersDialog
                open={open}
                currentBatch={sendProgress.currentBatch}
                totalBatches={sendProgress.totalBatches}
                sentCount={sendProgress.sentCount}
                totalCount={sendProgress.totalCount}
                batchSize={sendProgress.batchSize}
            />

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
                    <div>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
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
            {me.admin
                ? (
                    <Button
                        variant="outlined"
                        onClick={() => setIncludeMeNameFilter(!includeMeNameFilter)}
                        data-testid="admin-show-all-button"
                    >
                        {includeMeNameFilter ? 'Vis alle' : 'Bare min'}
                    </Button>
                )
                : null}

            <Box display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleConfirmSendPayments}
                    disabled={open || Object.keys(selectedOrders)
                        .filter((key) => selectedOrders[key].checked).length < 1}
                >
                    Send ordre til fakturering
                </Button>
            </Box>

            <SendToInvoiceTable
                filteredSuggestions={filteredSuggestions}
                selectedOrders={selectedOrders}
                includeMeFilter={includeMeNameFilter}
            />
        </Box>
    );
};

export default SendToInvoiceContainer;
