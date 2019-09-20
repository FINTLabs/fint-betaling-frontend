import React from 'react';
import {makeStyles, Paper} from "@material-ui/core";
import PickPaymentRecipient from "./pick_recipients/pick_payment_recipient";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        textAlign: "center"
    },
});

const TabContentHolder = (props) => {
    const {value} = props;
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            {(value === 0) ? <PickPaymentRecipient/> : (value === 1) ? <div>you</div>: <div>there</div>}
        </Paper>
    );
};

export default TabContentHolder;