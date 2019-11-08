import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Table from '@material-ui/core/Table';
import {makeStyles, Typography} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import {
    ORDER_NUMBER,
    PAYMENT_CANCELLED,
    PAYMENT_CREATED,
    PAYMENT_OVER_DUE,
    PAYMENT_PAYED,
    PAYMENT_WAITING
} from "../payment/constants";
import {CheckCircle, Edit, PaymentRounded, PriorityHigh, RemoveCircle, Warning} from '@material-ui/icons';
import {
    updateOrderStatusContent,
    updateOrderStatusOpen,
    updatePaymentsDialogOpen,
    updatePaymentsDialogOrderNumber
} from "../../data/redux/actions/payment";

const useStyles = makeStyles((theme) => ({
    table: {
        overflow: 'auto',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellStatus: {
        wordWrap: 'break-word',
        display: 'flex',
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    editIcon: {},
    payedIcon: {
        color: theme.palette.secondary.dark,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    waitingPaymentIcon: {
        color: theme.palette.secondary.light,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    createdCircularProgress: {
        color: theme.palette.secondary.main,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top'
    },
    warningIcon: {
        color: theme.status.danger,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top'
    },
    priorityIcon: {
        color: theme.status.danger,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    cancelledIcon: {
        color: 'red',
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    overDueIcon: {
        color: 'yellow',
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    statusText: {
        marginLeft: theme.spacing(1),
        alignSelf: 'center',
    },
}));

const PaymentsTable = () => {
    const query = useSelector((state) => state.payment.payments.searchValue);
    let suggestions = useSelector((state) => state.payment.payments.filteredSuggestions);
    const searchBy = useSelector((state) => state.payment.payments.searchBy)
        .toString();
    const filterValue = useSelector(state => state.payment.payments.filter);
    suggestions = query.length === 0 ? [] : suggestions;
    const classes = useStyles();
    const dispatch = useDispatch();
    const paymentNotSentFeedback = "Ordre er lagret, men ikke sendt til økonomisystem. Klikk på 'Send ordre' i hovedmenyen til venstre for å sende ordre til økonomisystem";

    function handleStatusClick(event, errormessage) {
        dispatch(updateOrderStatusContent(errormessage));
        dispatch(updateOrderStatusOpen(true));
    }

    function getStatus(suggestion) {
        return (parseInt(suggestion.restBelop) <= 0 ? PAYMENT_PAYED
                : !suggestion.sentTilEksterntSystem ? PAYMENT_CREATED
                    : suggestion.fakturagrunnlag.forfallsdato < Date.now() ? PAYMENT_OVER_DUE : PAYMENT_WAITING
        )
    }

    function getStatusIcon(suggestion) {
        const status = getStatus(suggestion);
        let paymentIcon;
        let statusText;

        switch (status) {
            case PAYMENT_PAYED:
                paymentIcon = <CheckCircle className={classes.payedIcon}/>;
                statusText = <Typography variant="body2" className={classes.statusText}>Betalt</Typography>;
                break;
            case PAYMENT_CREATED:
                if (suggestion.status === "ERROR") {
                    paymentIcon = <Warning className={classes.warningIcon}
                                           onClick={(e) => handleStatusClick(e, suggestion.error)}/>;
                    statusText =
                        <Typography variant="body2" className={classes.statusText}>Feil ved innsendelse</Typography>;
                } else {
                    paymentIcon = <PriorityHigh className={classes.priorityIcon}
                                                onClick={(e) => handleStatusClick(e, paymentNotSentFeedback)}/>;
                    statusText =
                        <Typography variant="body2" className={classes.statusText}>Ikke sendt</Typography>;
                }
                break;
            case PAYMENT_OVER_DUE:
                paymentIcon = <RemoveCircle className={classes.overDueIcon}/>;
                statusText = <Typography variant="body2" className={classes.statusText}>Over forfall</Typography>;
                break;
            case PAYMENT_CANCELLED:
                paymentIcon = <RemoveCircle className={classes.cancelledIcon}/>;
                statusText = <Typography variant="body2" className={classes.statusText}>Kansellert</Typography>;
                break;
            case PAYMENT_WAITING:
                paymentIcon = <PaymentRounded className={classes.waitingPaymentIcon}/>;
                statusText = <Typography variant="body2" className={classes.statusText}>Venter på betaling</Typography>;
                break;
        }
        return (
            <TableCell align="left" className={classes.tableCellStatus}>
                {paymentIcon}
                {statusText}
            </TableCell>
        );
    }

    function handleOpenDialog(orderNumber) {
        dispatch(updatePaymentsDialogOrderNumber(orderNumber));
        dispatch(updatePaymentsDialogOpen(true));
    }

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="left" className={classes.tableCell}>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Ordrenummer</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Totalpris</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Å betale</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Rediger</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    suggestions.map(
                        (suggestion) => {
                            const payment = searchBy === ORDER_NUMBER ? suggestion.orderNumber.toString() : suggestion.customer.name;
                            const matches = match(payment, query);
                            const parts = parse(payment, matches);

                            const orderNumberAndName = searchBy === ORDER_NUMBER
                                ? (
                                    <TableRow hover>
                                        {getStatusIcon(suggestion)}
                                        <TableCell align="left" className={classes.tableCell}>
                                            {suggestion.customer ? suggestion.customer.name : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {parts.map((part) => (
                                                <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                          {part.text}
                        </span>
                                            ))}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.fakturagrunnlag
                                                ? suggestion.fakturagrunnlag.netto
                                                    ? (parseInt(suggestion.fakturagrunnlag.netto) / 100).toFixed(2)
                                                    : '' : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.restBelop
                                                ? (parseInt(suggestion.restBelop) / 100).toFixed(2)
                                                : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <Button
                                                onClick={() => handleOpenDialog(suggestion.orderNumber)}
                                            >
                                                <Edit/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                                : (
                                    <TableRow hover>
                                        {getStatusIcon(suggestion)}
                                        <TableCell align="left" className={classes.tableCell}>
                                            {parts.map((part) => (
                                                <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                          {part.text}
                        </span>
                                            ))}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.orderNumber ? suggestion.orderNumber : ''}
                                        </TableCell>

                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.fakturagrunnlag
                                                ? suggestion.fakturagrunnlag.netto
                                                    ? (parseInt(suggestion.fakturagrunnlag.netto) / 100).toFixed(2)
                                                    : '' : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.restBelop
                                                ? (parseInt(suggestion.restBelop) / 100).toFixed(2)
                                                : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <Button
                                                onClick={() => handleOpenDialog(suggestion.orderNumber)}
                                            >
                                                <Edit/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );

                            return (
                                orderNumberAndName
                            );
                        },
                    )
                }
            </TableBody>
        </Table>
    );
};

export default PaymentsTable;
