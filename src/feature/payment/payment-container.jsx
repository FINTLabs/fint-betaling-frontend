import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as Integer from 'lodash';
import PaymentStepper from './payment-stepper';
import PickPaymentRecipient from './step/pick-recipients/pick-recipient';
import PickProducts from './step/pick-product/pick-products';
import ConfirmSend from './step/confirm-send/confirm-send';
import PaymentSaved from './step/payment-saved/payment-saved';

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
