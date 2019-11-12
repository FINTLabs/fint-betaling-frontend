import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import {updatePaymentsDialogOpen} from '../../data/redux/actions/payment';


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 150,
    },
}));

const EditDialog = () => {
    const classes = useStyles();
    const dialogOpen = useSelector((state) => state.payment.payments.dialogOpen);
    const dialogOrderNumber = useSelector((state) => state.payment.payments.dialogOrderNumber);
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payments.payments);
    let selectedPayment;

    Object.keys(payments)
        .filter(key => payments[key] && payments[key].orderNumber && payments[key].orderNumber === dialogOrderNumber).map(key => {
        selectedPayment = payments[key];
        return null;
    });

    function handleClose() {
        dispatch(updatePaymentsDialogOpen(false));
    }

    function handleChange() {

    }

    function handleDateChange() {

    }

    function getDate(dateAsLong) {
        const date = new Date(dateAsLong);
        return date;
    }

    return (
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle
                id="form-dialog-title"
            >
                Ordrenummer:
                {' '}
                {selectedPayment ? selectedPayment.orderNumber : ''}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Endringer utført på betalingen vil medføre en ny betalingoppfordring til mottakeren.
                </DialogContentText>
                <form className={classes.container}>
                    <TextField
                        id="price"
                        label="Oppdater beløp"
                        className={classes.textField}
                        value={selectedPayment ? (parseInt(selectedPayment.restBelop) / 100).toFixed(2) : ''}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Ny forfallsdato"
                            value={selectedPayment ? getDate(selectedPayment.fakturagrunnlag.forfallsdato) : new Date('2000-01-01T21:11:54')}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </form>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Tilbake
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Send ny betalingsoppfordring
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
