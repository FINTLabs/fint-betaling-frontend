import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Dialog,
    CircularProgress,
} from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ClaimRepository from '../../../data/repository/ClaimRepository';
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
        && (includeMeNameFilter ? payment.createdBy.name === me.name : true));
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
        setOpen(true);
        ClaimRepository.sendOrders(
            orgId,
            Object.keys(selectedOrders)
                .filter((key) => selectedOrders[key].checked),
        ).then(([response, data]) => {
            if (response.status === 201) {
                dispatch(updateSendOrderResponse(data));
                dispatch(updateOrderSearchValue(1));
                dispatch(updateRedirectFromExternal(true));
                dispatch(updateLoadingSendingInvoice(false));
                dispatch(updateNeedFetch(true));
                dispatch(fetchPaymentsStatusCountUnsent('STORED'));
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
            })
            .finally(() => {
                setOpen(false);
            });
        dispatch(updateLoadingSendingInvoice(true));
        clearSearchValue();
    };

    return (
        <Box width="80%" alignSelf="center" mt={4}>
            <div>
                <Dialog
                    open={open}
                    BackdropProps={{ invisible: true }}
                    PaperProps={{ style: { borderRadius: '20px' } }}
                    id="loading-dialog"
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '150px',
                            width: '300px',
                        }}
                    >
                        <Typography variant="h5">Ordre sendes...</Typography>
                        <CircularProgress style={{ marginTop: '20px' }} />
                    </div>
                </Dialog>
            </div>

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
                    disabled={Object.keys(selectedOrders)
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
