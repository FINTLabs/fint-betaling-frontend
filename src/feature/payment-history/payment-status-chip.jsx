import PropTypes from 'prop-types';
import React from 'react';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { useDispatch } from 'react-redux';
import Chip from '@mui/material/Chip';
import { updateOrderStatusContent, updateOrderStatusOpen } from '../../data/redux/actions/payment';
import { FILTER_LIST } from '../payment/constants';

const PaymentStatusChip = ({ payment }) => {
    const dispatch = useDispatch();

    const paymentNotSentFeedback = 'Ordre er lagret, men ikke sendt til økonomisystem. Gå til \'Send ordre\' i'
        + ' hovedmenyen til venstre for å sende ordre til økonomisystem';

    function getMessage(message, value) {
        if (message) {
            return JSON.parse(message).message;
        }
        if (value === 'STORED') {
            return paymentNotSentFeedback;
        }
        return 'Sorry, men vi har ikke fått noen detaljer fra økonomisystemet!';
    }

    function handleStatusClick(event, errormessage, value) {
        dispatch(updateOrderStatusContent(getMessage(errormessage, value)));
        dispatch(updateOrderStatusOpen(true));
    }

    // const claimStatus = payment.row.claimStatus;

    let thisStatus = FILTER_LIST.find((element) => element.value === payment.row.claimStatus);
    if (!thisStatus) {
        thisStatus = {
            value: '',
            icon: <ErrorOutline />, // todo: find a better icon
            label: 'Klarte ikke finne ordrestatus',
            color: 'error',
        };
    }

    return (
        <>
            <Chip
                icon={thisStatus.icon}
                label={thisStatus.label}
                variant="outlined"
                color={thisStatus.color}
                onClick={(e) => handleStatusClick(e, thisStatus.statusMessage, thisStatus.value)}
            />
        </>
    );
};

PaymentStatusChip.propTypes = {
    payment: PropTypes.object.isRequired,
};

export default PaymentStatusChip;
