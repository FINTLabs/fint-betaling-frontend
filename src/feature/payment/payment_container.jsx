import React from 'react';
import {Box, makeStyles} from '@material-ui/core';
import {useSelector} from 'react-redux';
import * as Integer from 'lodash';
import PaymentStepper from './payment_stepper';
import PickPaymentRecipient from './step/pick_recipients/pick_recipient';
import PickProducts from './step/pick_product/pick_products';
import ConfirmSend from './step/confirm_send/confirm_send';
import PaymentSaved from './step/payment_saved/payment_saved';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const PaymentContainer = () => {
    const classes = useStyles();
    const step = useSelector((state) => state.payment.form.step);

    let content;
    if (Integer.parseInt(step.toString()) === 0) {
        content = <PickPaymentRecipient/>;
    } else if (Integer.parseInt(step.toString()) === 1) {
        content = <PickProducts/>;
    } else if (Integer.parseInt(step.toString()) === 2) {
        content = <ConfirmSend/>;
    } else if (Integer.parseInt(step.toString()) === 3) {
        content = <PaymentSaved/>;
    }

    return (
        <Box className={classes.root}>
            <PaymentStepper/>
            {content}
        </Box>
    );
};

export default PaymentContainer;
