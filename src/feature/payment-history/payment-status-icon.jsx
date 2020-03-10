import PropTypes from 'prop-types';
import React from 'react';
import {
    CheckCircle, PaymentRounded, PriorityHigh, Warning,
} from '@material-ui/icons';
import { makeStyles, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateOrderStatusContent, updateOrderStatusOpen } from '../../data/redux/actions/payment';

const useStyles = makeStyles((theme) => ({
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
    warningIcon: {
        color: theme.status.danger,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    priorityIcon: {
        color: theme.status.danger,
        width: '35px',
        height: '35px',
        verticalAlign: 'text-top',
    },
    statusText: {
        marginLeft: theme.spacing(1),
        alignSelf: 'center',
    },
}));

const PaymentStatusIcon = ({ payment }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const paymentNotSentFeedback = 'Ordre er lagret, men ikke sendt til økonomisystem. Gå til \'Send ordre\' i'
        + ' hovedmenyen til venstre for å sende ordre til økonomisystem';

    let paymentIcon;
    let statusText;

    function getMessage(message) {
        if (message) {
            return JSON.parse(message).message;
        }
        return 'Sorry, men vi har ikke fått noen detaljer fra økonomisystemet!';
    }

    function handleStatusClick(event, errormessage) {
        dispatch(updateOrderStatusContent(getMessage(errormessage)));
        dispatch(updateOrderStatusOpen(true));
    }

    switch (payment.claimStatus) {
    case 'STORED':
        paymentIcon = (
            <PriorityHigh
                className={classes.priorityIcon}
                onClick={(e) => handleStatusClick(e, paymentNotSentFeedback)}
            />
        );
        statusText = <Typography variant="body2" className={classes.statusText}>Lagret, ikke fakturert</Typography>;
        break;
    case 'UPDATE_ERROR':
        paymentIcon = (
            <Warning
                className={classes.warningIcon}
                onClick={(e) => handleStatusClick(e, payment.statusMessage)}
            />
        );
        statusText = <Typography variant="body2" className={classes.statusText}>Feil ved oppdatering</Typography>;
        break;
    case 'SEND_ERROR':
        paymentIcon = (
            <Warning
                className={classes.warningIcon}
                onClick={(e) => handleStatusClick(e, payment.statusMessage)}
            />
        );
        statusText = <Typography variant="body2" className={classes.statusText}>Feil ved innsendelse</Typography>;
        break;
    case 'ERROR':
        paymentIcon = (
            <Warning
                className={classes.warningIcon}
                onClick={(e) => handleStatusClick(e, payment.statusMessage)}
            />
        );
        statusText = <Typography variant="body2" className={classes.statusText}>Ukjent feil</Typography>;
        break;
    case 'ACCEPT_ERROR':
        paymentIcon = (
            <Warning
                className={classes.warningIcon}
                onClick={(e) => handleStatusClick(e, payment.statusMessage)}
            />
        );
        statusText = (
            <Typography variant="body2" className={classes.statusText}>
                Feil ved oversending til
                økonomisystemet
            </Typography>
        );
        break;
    case 'PAYED':
        paymentIcon = <CheckCircle className={classes.payedIcon} />;
        statusText = <Typography variant="body2" className={classes.statusText}>Betalt</Typography>;
        break;
    case 'SENT':
        paymentIcon = <PaymentRounded className={classes.waitingPaymentIcon} />;
        statusText = <Typography variant="body2" className={classes.statusText}>Venter på betaling</Typography>;
        break;
    default:
        paymentIcon = (
            <Warning
                className={classes.warningIcon}
                onClick={(e) => handleStatusClick(e, payment.error)}
            />
        );
        statusText = (
            <Typography variant="body2" className={classes.statusText}>
                Klarte ikke finne
                ordrestatus
            </Typography>
        );
        break;
    }
    return (
        <>
            {paymentIcon}
            {statusText}
        </>
    );
};

PaymentStatusIcon.propTypes = {
    payment: PropTypes.object.isRequired,
};

export default PaymentStatusIcon;
