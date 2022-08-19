import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import { updateInvoiceSnackbarOpen } from '../../data/redux/actions/payment';

const PaymentSnackbar = () => {
    const dispatch = useDispatch();
    const showSnackbar = useSelector((state) => state.payment.payment.snackbarOpen);
    const snackbarMessage = useSelector((state) => state.payment.payment.snackbarContent);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(updateInvoiceSnackbarOpen(false));
    };

    return (
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
    );
};

export default PaymentSnackbar;
