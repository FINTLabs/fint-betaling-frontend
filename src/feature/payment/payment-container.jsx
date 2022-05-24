import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import * as Integer from 'lodash';
import PaymentStepper from './payment-stepper';
import PickPaymentRecipient from './step/pick-recipients/pick-recipient';
import PickProducts from './step/pick-product/pick-products';
import ConfirmSend from './step/confirm-send/confirm-send';
import PaymentSaved from './step/payment-saved/payment-saved';

const PaymentContainer = () => {
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
        <Box flexGrow="1" mt={4} width="90%" display="flex" flexDirection="column" alignItems="center">
            <PaymentStepper />
            {getStep()}
        </Box>
    );
};

export default PaymentContainer;
