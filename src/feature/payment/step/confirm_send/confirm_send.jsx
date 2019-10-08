import React from 'react';
import {Box, makeStyles, Paper} from "@material-ui/core";
import ConfirmedRecipients from "./confirmed_recipients";
import ConfirmedProducts from "./confirmed_products";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexBasis:"250px",
        justifyContent: 'center',
        padding: theme.spacing(0.5),
        alignContent: "center",
        textAlign: "center",
        flex: "0 0 25rem",
    },
    confirmPaper: {
        display: "flex",
        margin: theme.spacing(1),
    }
}));

const ConfirmSend = () => {
    const classes = useStyles();



    return (
        <Box className={classes.root}>
            <Paper className={classes.confirmPaper}>
                <ConfirmedRecipients/>
                <Divider/>
                <ConfirmedProducts/>
            </Paper>
        </Box>
    );
};

export default ConfirmSend;