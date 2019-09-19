import React from 'react';
import PaymentInputController from "./payment_input_controller";
import PaymentTypeSelection from "./payment_type_selection";
import {Box} from "@material-ui/core";
import PaymentStepper from "./payment_stepper";

const PaymentContainer = () => {
    return (
        <Box>
            <PaymentStepper/>
            <PaymentTypeSelection/>
        <PaymentInputController/>
        </Box>
    );
};

export default PaymentContainer;