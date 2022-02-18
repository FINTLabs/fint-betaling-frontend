import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
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
