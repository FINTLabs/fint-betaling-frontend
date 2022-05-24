import React from 'react';
import {
    CheckCircle, ErrorOutline, NotInterested, Payment, Warning,
} from '@mui/icons-material/';

export const GROUP = 'group';
export const INDIVIDUAL = 'individual';
export const ORDER_NUMBER = 'order_number';

export const STEP_PICK_RECIPIENTS = 0;
export const STEP_PICK_PRODUCTS = 1;
export const STEP_CONFIRM_PAYMENT = 2;
export const STEP_PAYMENT_CONFIRMED = 3;

export const SEARCH_PAGE_START = 0;
export const SEARCH_PAGE_ROWS = 10;

export const FILTER_ALL = 'ALL';
export const FILTER_LIST = [
    {
        value: 'STORED',
        label: 'Ikke sendt',
        icon: <ErrorOutline />,
        color: 'info',
    },
    {
        value: 'SENT',
        label: 'Sendt til økonomisystem',
        icon: <Payment />,
        color: 'info',
    },
    {
        value: 'ACCEPTED',
        label: 'Klar til fakturering',
        icon: <Payment />,
        color: 'success',
    },
    {
        value: 'ISSUED',
        label: 'Fakturert',
        icon: <Payment />,
        color: 'success',
    },
    {
        value: 'PAID',
        label: 'Betalt',
        icon: <CheckCircle />,
        color: 'success',
    },
    {
        value: 'UPDATE_ERROR',
        label: 'Oppdateringsfeil',
        icon: <Warning />,
        color: 'error',
    },
    {
        value: 'ACCEPT_ERROR',
        label: 'Feil fra økonomisystemet',
        icon: <Warning />,
        color: 'error',
    },
    {
        value: 'SEND_ERROR',
        label: 'Feil ved sending',
        icon: <Warning />,
        color: 'error',
    },
    {
        value: 'ERROR',
        label: 'Generell feil',
        icon: <Warning />,
        color: 'error',
    },
    {
        value: 'CANCELLED',
        label: 'Kansellerte',
        icon: <NotInterested />,
        color: 'warning',
    },
];
