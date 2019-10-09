import React from 'react';
import {Box, makeStyles, Paper} from "@material-ui/core";
import ConfirmedRecipients from "./confirmed_recipients";
import ConfirmedProducts from "./confirmed_products";
import ExpirationDatePicker from "./expiration_date_picker";
import Button from "@material-ui/core/Button";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexBasis: "250px",
        justifyContent: 'center',
        padding: theme.spacing(0.5),
        alignContent: "center",
        textAlign: "center",
        flex: "0 0 25rem",
    },
    confirmPaper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1),
    },
    expirationContainer: {
        alignSelf: "flex-end",
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        "&:enabled": {
            backgroundColor: theme.palette.secondary.main,
        },
        "&:disabled": {
        },
        verticalAlign: "bottom",
        margin: theme.spacing(2),
    },
}));

const ConfirmSend = () => {
    const classes = useStyles();
    const expirationDate = useSelector(state => state.payment.payment.expirationDate);
    let confirmButtonDisabled = true;
    if (expirationDate)
        confirmButtonDisabled = false;
    return (
        <Box className={classes.root}>
            <Paper className={classes.confirmPaper}>
                <ConfirmedRecipients/>
                <ConfirmedProducts/>
                <Box className={classes.expirationContainer}>
                    <ExpirationDatePicker/>
                    <Button disabled={confirmButtonDisabled} className={classes.confirmButton}>Send fakturaer</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ConfirmSend;