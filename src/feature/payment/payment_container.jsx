import React, {useEffect, useState} from 'react';
import {Box, makeStyles} from "@material-ui/core";
import PaymentStepper from "./payment_stepper";
import {useDispatch} from "react-redux";
import {fetchCustomer} from "../../data/redux/actions/customers";
import {fetchGroup} from "../../data/redux/actions/groups";
import PickPaymentRecipient from "./step/pick_recipients/pick_recipient";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const PaymentContainer = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
            dispatch(fetchCustomer());
            dispatch(fetchGroup());
        }, []
    )

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <Box className={classes.root}>
            <PaymentStepper/>
            <PickPaymentRecipient/>
        </Box>
    );
};

export default PaymentContainer;