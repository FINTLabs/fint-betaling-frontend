export const GROUP = 'group';
export const INDIVIDUAL = 'individual';

export const ORDER_NUMBER = 'order_number';
export const CUSTOMER_NAME = 'customer_name';

export const STEP_PICK_RECIPIENTS = 0;
export const STEP_PICK_PRODUCTS = 1;
export const STEP_CONFIRM_PAYMENT = 2;
export const STEP_PAYMENT_CONFIRMED = 3;

export const SEARCH_PAGE_START = 0;
export const SEARCH_PAGE_ROWS = 10;

export const FILTER_ALL = 'ALL';
export const FILTER_LIST = [
    {
        key: FILTER_ALL,
        label: 'Alle',
    },
    {
        key: 'SENT',
        label: 'Ubetalt',
    },
    {
        key: 'STORED',
        label: 'Ikke sendt',
    },
    {
        key: 'PAYED',
        label: 'Betalt',
    },
    {
        key: 'UPDATE_ERROR',
        label: 'Oppdateringsfeil',
    },
    {
        key: 'ACCEPT_ERROR',
        label: 'Feil fra økonomisystemet',
    },
    {
        key: 'SEND_ERROR',
        label: 'Feil ved sending',
    },
    {
        key: 'ERROR',
        label: 'Generell feil',
    },
];
