import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as Integer from 'lodash';
import PaymentStepper from './payment_stepper';
import PickPaymentRecipient from './step/pick_recipients/pick-recipient';
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

    function getStep() {
        if (Integer.parseInt(step.toString()) === 0) {
            return <PickPaymentRecipient />;
        }
        if (Integer.parseInt(step.toString()) === 1) {
            return <PickProducts />;
        }
        if (Integer.parseInt(step.toString()) === 2) {
            return <ConfirmSend />;
        }
        if (Integer.parseInt(step.toString()) === 3) {
            return <PaymentSaved />;
        }
        return <Box />;
    }

    return (
        <Box className={classes.root} width="75%" display="flex" flexDirection="column" alignItems="center">
            <PaymentStepper />
            {getStep()}
        </Box>
    );
};

export default PaymentContainer;
