import React from 'react';
import {Box, makeStyles} from "@material-ui/core";
import PaymentStepper from "./payment_stepper";
import {useSelector} from "react-redux";
import PickPaymentRecipient from "./step/pick_recipients/pick_recipient";
import PickProducts from "./step/pick_product/pick_products";
import * as Integer from "lodash";
import ConfirmSend from "./step/confirm_send/confirm_send";
import PaymentSent from "./step/payment_sent/payment_sent";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const PaymentContainer = () => {
    const classes = useStyles();
    const step = useSelector(state => state.payment.form.step);

    let content;
    if (Integer.parseInt(step.toString()) === 0) {
        content = <PickPaymentRecipient/>;
    } else if (Integer.parseInt(step.toString()) === 1) {
        content = <PickProducts/>
    } else if (Integer.parseInt(step.toString()) === 2) {
        content = <ConfirmSend/>
    } else if (Integer.parseInt(step.toString()) === 3) {
        content = <PaymentSent/>
    }

    return (
        <Box className={classes.root}>
            <PaymentStepper/>
            {content}
        </Box>
    );
};

export default PaymentContainer;