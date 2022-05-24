import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatusContent, updateOrderStatusOpen } from '../../data/redux/actions/payment';

const PaymentStatusMessageDialog = () => {
    const dispatch = useDispatch();

    const statusOpen = useSelector((state) => state.payment.payment.statusOpen);
    const statusMessage = useSelector((state) => state.payment.payment.statusContent);

    const handleClose = () => {
        dispatch(updateOrderStatusOpen(false));
        dispatch(updateOrderStatusContent(''));
    };

    return (
        <Dialog
            open={statusOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Status: </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {statusMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Lukk
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentStatusMessageDialog;
