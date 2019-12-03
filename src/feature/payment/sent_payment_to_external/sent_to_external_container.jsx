import React from 'react';
import {Box, makeStyles, Paper, Typography,} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import {Check, Warning} from "@material-ui/icons";
import {initializePayment, updateOrderStatusContent, updateOrderStatusOpen} from "../../../data/redux/actions/payment";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Amount from "../utils/amount";
import {Link} from "react-router-dom";
import {INITIALIZE_PAYMENT} from "../../../data/redux/actions/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        alignSelf: 'center',
        margin: 'auto',
    },
    table: {
        overflow: 'auto',
        minWidth: '100%',
        maxWidth: '100%',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
        paddingTop: 0,
        paddingBottom: 0,
    },
    confirmButton: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: 'auto',
        marginTop: theme.spacing(1),
    },
    buttonContainer: {
        marginTop: theme.spacing(2),
    },
    buttonToNewOrder: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: theme.spacing(1),
        float: 'left',
    },
    buttonSendMore: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: theme.spacing(1),
        float: 'right',
    },
    checkIcon: {
        color: theme.palette.secondary.main,
    },
    warningIcon: {
        color: theme.status.danger,
    },
}));

const SentToExternalContainer = () => {
    const data = useSelector((state) => state.payment.backEndResponse.responseOrder);
    const statusOpen = useSelector(state => state.payment.payment.statusOpen);
    const statusContent = useSelector(state => state.payment.payment.statusContent);
    const classes = useStyles();
    const dispatch = useDispatch();


    function handleStatusClick(event, errormessage) {
        dispatch(updateOrderStatusContent(errormessage));
        dispatch(updateOrderStatusOpen(true));
    }

    function handleClose() {
        dispatch(updateOrderStatusOpen(false));
        dispatch(updateOrderStatusContent(''));
    }

    return (
        <Box className={classes.root}>
            <Typography variant="h4">Ordre sendt til fakturering</Typography>
            <Typography variant="body1">Følgende ordre er sendt til fakturering</Typography>

            {data
                ? (
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ordrenummer</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Restbeløp eks. mva.</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map(
                                    suggestion => {
                                        const orderStatus =
                                            (
                                                <TableCell align="right" className={classes.tableCell}>
                                                    {suggestion.claimStatus === "SEND_ERROR" ||
                                                    suggestion.claimStatus === "UPDATE_ERROR" ?
                                                        <Warning
                                                            value={suggestion.error}
                                                            className={classes.warningIcon}
                                                            onClick={(e) => handleStatusClick(e, suggestion.statusMessage)}
                                                        />
                                                        :
                                                        <Check value={suggestion.error} className={classes.checkIcon}
                                                               onClick={handleStatusClick}/>
                                                    }
                                                </TableCell>
                                            );
                                        return (
                                            <TableRow hover key={suggestion.orderNumber}>
                                                <TableCell align="left" className={classes.tableCell}>
                                                    {suggestion.orderNumber}
                                                </TableCell>
                                                <TableCell align="right" className={classes.tableCell}>
                                                    {suggestion.customer
                                                        ? suggestion.customer.name
                                                            ? suggestion.customer.name
                                                            : '' : ''}
                                                </TableCell>
                                                <TableCell align="right" className={classes.tableCell}>
                                                    {suggestion.originalAmountDue
                                                        ? Amount.currency(suggestion.originalAmountDue) : ''}
                                                </TableCell>
                                                {orderStatus}
                                            </TableRow>
                                        )
                                    }
                                )
                            }
                        </TableBody>
                    </Table>
                )
                : <div/>}
            {data
                ? (
                    <Paper className={classes.buttonContainer}>
                        <Link to="/opprett-ordre" onClick={() => {
                            dispatch(initializePayment(INITIALIZE_PAYMENT));
                        }} className={classes.cardLink}>
                            <Button className={classes.buttonToNewOrder}>Opprett nye ordre</Button>
                        </Link>
                        <Link to="/ordrehistorikk" onClick={() => {
                            dispatch(initializePayment(INITIALIZE_PAYMENT));
                        }} className={classes.cardLink}>
                            <Button className={classes.buttonSendMore}>Følg med i ordrehistorikken</Button>
                        </Link>
                    </Paper>
                )
                : <div/>}
            <Dialog
                open={statusOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Status: </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {statusContent ? statusContent : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Tilbake
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SentToExternalContainer;
