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
import {updateOrderStatusContent, updateOrderStatusOpen} from "../../../data/redux/actions/payment";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

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
            <Typography variant="h4">Ordre sendt til økonomisystem</Typography>
            <Typography variant="body1">Følgende ordre er sendt til fakturasystem</Typography>

            {data
                ? (
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ordrenummer</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
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
                                                    {suggestion.status === "ERROR" ?
                                                        <Warning
                                                            value={suggestion.error}
                                                            className={classes.warningIcon}
                                                            onClick={(e) => handleStatusClick(e, suggestion.error)}
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
                                                        ? (parseInt(suggestion.originalAmountDue) / 100).toFixed(2) : ''}
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
                        <Button className={classes.buttonToNewOrder}>Opprett nye ordre</Button>
                        <Button className={classes.buttonSendMore}>Send flere lagrede ordre til økonomisystem</Button>
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
                        {statusContent ? statusContent : "Godkjent"}
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
