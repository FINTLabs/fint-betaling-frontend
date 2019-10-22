import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {useDispatch, useSelector} from "react-redux";
import {updatePaymentsDialogOpen} from "../../data/redux/actions/payment";
import {makeStyles} from "@material-ui/core";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';


const useStyles = makeStyles(theme => ({
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
    const dialogOpen = useSelector(state => state.payment.payments.dialogOpen);
    const dialogOrderNumber = useSelector(state => state.payment.payments.dialogOrderNumber);
    const dispatch = useDispatch();
    const payments = useSelector(state => state.payments.payments);
    let selectedPayment;

    Object.keys(payments).map(key => {
        if (payments[key] && payments[key].ordrenummer && payments[key].ordrenummer === dialogOrderNumber) {
            selectedPayment = payments[key];
            console.log(payments[key]);
        }
    });

    function handleClose() {
        dispatch(updatePaymentsDialogOpen(false));
    }

    function handleChange() {

    }

    function handleDateChange() {

    }

    function getDate(dateAsLong) {
        let date = new Date(dateAsLong);
        /*const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();

        date = mm + '/' + dd + '/' + yyyy;*/
        return date;
    }

    return (
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle
                id="form-dialog-title">Ordrenummer: {selectedPayment ? selectedPayment.ordrenummer : ''}</DialogTitle>
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