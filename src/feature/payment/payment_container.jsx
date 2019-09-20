import React, {useEffect, useState} from 'react';
import {Box, makeStyles} from "@material-ui/core";
import PaymentStepper from "./payment_stepper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabContentHolder from "./step/tab_content_holder";
import {useDispatch} from "react-redux";
import {fetchCustomer} from "../../data/redux/actions/customers";
import {fetchGroup} from "../../data/redux/actions/groups";

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
            <TabContentHolder value={value}/>
        </Box>
    );
};

export default PaymentContainer;