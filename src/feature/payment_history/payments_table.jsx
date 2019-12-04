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
import {ORDER_NUMBER} from "../payment/constants";
import {CheckCircle, Edit, PaymentRounded, PriorityHigh, Warning} from '@material-ui/icons';
import {
    updateOrderStatusContent,
    updateOrderStatusOpen,
    updatePaymentsDialogOpen,
    updatePaymentsDialogOrderNumber
} from "../../data/redux/actions/payment";
import Amount from "../payment/utils/amount";

const useStyles = makeStyles((theme) => ({
    table: {
        overflow: 'auto',
        maxWidth: '80%',
        marginTop: theme.spacing(1),
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
    const searchBy = useSelector((state) => state.payment.payments.searchBy).toString();
    suggestions = query.length === 0 ? [] : suggestions;
    const classes = useStyles();
    const dispatch = useDispatch();
    const paymentNotSentFeedback = "Ordre er lagret, men ikke sendt til økonomisystem. Klikk på 'Send ordre' i hovedmenyen til venstre for å sende ordre til økonomisystem";

    function handleStatusClick(event, errormessage) {
        dispatch(updateOrderStatusContent(errormessage));
        dispatch(updateOrderStatusOpen(true));
    }

    function getStatusIcon(suggestion) {
        const status = suggestion.claimStatus;
        let paymentIcon;
        let statusText;

        switch (status) {
            case "STORED":
                paymentIcon = <PriorityHigh className={classes.priorityIcon}
                                            onClick={(e) => handleStatusClick(e, paymentNotSentFeedback)}/>;
                statusText =
                    <Typography variant="body2" className={classes.statusText}>Lagret, ikke fakturert</Typography>;
                break;
            case "UPDATE_ERROR":
                paymentIcon = <Warning className={classes.warningIcon}
                                       onClick={(e) => handleStatusClick(e, suggestion.statusMessage)}/>;
                statusText =
                    <Typography variant="body2" className={classes.statusText}>Feil ved oppdatering</Typography>;
                break;
            case "SEND_ERROR":
                paymentIcon = <Warning className={classes.warningIcon}
                                       onClick={(e) => handleStatusClick(e, suggestion.statusMessage)}/>;
                statusText =
                    <Typography variant="body2" className={classes.statusText}>Feil ved innsendelse</Typography>;
                break;
            case "ERROR":
                paymentIcon = <Warning className={classes.warningIcon}
                                       onClick={(e) => handleStatusClick(e, suggestion.statusMessage)}/>;
                statusText =
                    <Typography variant="body2" className={classes.statusText}>Ukjent feil</Typography>;
                break;
            case "PAYED":
                paymentIcon = <CheckCircle className={classes.payedIcon}/>;
                statusText = <Typography variant="body2" className={classes.statusText}>Betalt</Typography>;
                break;
            case "SENT":
                paymentIcon = <PaymentRounded className={classes.waitingPaymentIcon}/>;
                statusText = <Typography variant="body2" className={classes.statusText}>Venter på betaling</Typography>;
                break;
            default:
                paymentIcon = <Warning className={classes.warningIcon}
                                       onClick={(e) => handleStatusClick(e, suggestion.error)}/>;
                statusText =
                    <Typography variant="body2" className={classes.statusText}>Klarte ikke finne
                        ordrestatus</Typography>;
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

    if (query.length < 1) {
        return <div/>;
    } else {
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
                                        <TableRow hover key={suggestion.orderNumber}>
                                            {getStatusIcon(suggestion)}
                                            <TableCell align="left" className={classes.tableCell}>
                                                {suggestion.customer ? suggestion.customer.name : ''}
                                            </TableCell>
                                            <TableCell align="right" className={classes.tableCell}>
                                                {parts.map((part) => (
                                                    <span key={part.text}
                                                          style={{fontWeight: part.highlight ? 500 : 400}}>
                          {part.text}
                        </span>
                                                ))}
                                            </TableCell>
                                            <TableCell align="right" className={classes.tableCell}>
                                                {suggestion.originalAmountDue
                                                    ? Amount.currency(suggestion.originalAmountDue)
                                                    : ''}
                                            </TableCell>
                                            <TableCell align="right" className={classes.tableCell}>
                                                {suggestion.amountDue
                                                    ? Amount.currency(suggestion.amountDue)
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
                                        <TableRow hover key={suggestion.orderNumber}>
                                            {getStatusIcon(suggestion)}
                                            <TableCell align="left" className={classes.tableCell}>
                                                {parts.map((part) => (
                                                    <span key={part.text}
                                                          style={{fontWeight: part.highlight ? 500 : 400}}>
                          {part.text}
                        </span>
                                                ))}
                                            </TableCell>
                                            <TableCell align="right" className={classes.tableCell}>
                                                {suggestion.orderNumber ? suggestion.orderNumber : ''}
                                            </TableCell>
                                            <TableCell align="right" className={classes.tableCell}>
                                                {suggestion.originalAmountDue
                                                    ? Amount.currency(suggestion.originalAmountDue)
                                                    : ''}
                                            </TableCell>
                                            <TableCell align="right" className={classes.tableCell}>
                                                {suggestion.amountDue
                                                    ? Amount.currency(suggestion.amountDue)
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
                            }
                            ,
                        )
                    }
                </TableBody>
            </Table>
        );
    }
};

export default PaymentsTable;
