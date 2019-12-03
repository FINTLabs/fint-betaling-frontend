import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import {makeStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from 'react-redux';
import {CUSTOMER_NAME, ORDER_NUMBER} from '../payment/constants';
import PaymentSearch from './payment_search';
import {updateNeedFetch, updatePaymentsSearchBy} from '../../data/redux/actions/payment';
import EditDialog from './edit_dialog';
import {fetchPayment} from "../../data/redux/actions/payments";
import FilterSelect from "./filter_selection";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    formControl: {
        flex: '1/3',
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(3),
        marginTop: theme.spacing(3),
    },
}));

const PaymentHistoryContainer = () => {
    const classes = useStyles();
    const searchBy = useSelector((state) => state.payment.payments.searchBy);
    const needsFetch = useSelector(state => state.payment.sendToExternalSystem.needFetch);
    const dispatch = useDispatch();

    if (needsFetch) {
        dispatch(fetchPayment());
        dispatch(updateNeedFetch(false));
    }

    function handleSearchBy(event) {
        dispatch(updatePaymentsSearchBy(event.target.value));
    }

    return (
        <Box className={classes.root}>
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup
                        aria-label="recipientType"
                        name="recipientType"
                        value={searchBy}
                        onChange={handleSearchBy}
                    >
                        <FormControlLabel value={ORDER_NUMBER.toString()} control={<Radio/>} label="Ordrenummer"/>
                        <FormControlLabel value={CUSTOMER_NAME.toString()} control={<Radio/>} label="Navn"/>
                    </RadioGroup>
                    <FilterSelect/>
                </FormControl>
            </form>
            <PaymentSearch/>
            <EditDialog/>

        </Box>
    );
};

export default PaymentHistoryContainer;
