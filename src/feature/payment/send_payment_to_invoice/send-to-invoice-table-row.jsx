import PropTypes from 'prop-types';
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import Amount from '../utils/amount';

const useStyles = makeStyles(() => ({
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
        paddingTop: 0,
        paddingBottom: 0,
    },
}));

const SendToInvoiceTableRow = ({
    suggestion, selectedOrders, handleIndividualCheck, key,
}) => {
    const classes = useStyles();

    return (
        <TableRow hover key={key}>
            <TableCell align="left" className={classes.tableCell}>
                {suggestion.orderNumber}
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                {suggestion.customer.name}
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                {suggestion.originalAmountDue
                    ? Amount.currency(suggestion.originalAmountDue) : ''}
            </TableCell>
            <TableCell align="center" className={classes.tableCell}>
                <Checkbox
                    checked={selectedOrders[suggestion.orderNumber]
                        ? selectedOrders[suggestion.orderNumber].checked
                        : false}
                    onChange={handleIndividualCheck}
                    value={suggestion.orderNumber}
                />
            </TableCell>
        </TableRow>
    );
};


SendToInvoiceTableRow.propTypes = {
    handleIndividualCheck: PropTypes.func.isRequired,
    key: PropTypes.string.isRequired,
    selectedOrders: PropTypes.array.isRequired,
    suggestion: PropTypes.object.isRequired,
};

export default SendToInvoiceTableRow;
