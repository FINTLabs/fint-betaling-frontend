import PropTypes from 'prop-types';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';
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
    suggestion,
    selectedOrders,
    handleIndividualCheck,
    includeMeFilter,
}) => {
    const classes = useStyles();

    return (
        <TableRow hover>
            <TableCell align="left" className={classes.tableCell}>
                <Checkbox
                    checked={selectedOrders[suggestion.orderNumber]
                        ? selectedOrders[suggestion.orderNumber].checked
                        : false}
                    onChange={handleIndividualCheck}
                    value={suggestion.orderNumber}
                />
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
                {suggestion.orderNumber}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
                {suggestion.customer.name}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
                {suggestion.organisationUnit.name}
            </TableCell>
            {!includeMeFilter
                ? (
                    <TableCell align="left" className={classes.tableCell}>
                        {suggestion.createdBy.name}
                    </TableCell>
                )
                : null}
            <TableCell align="right" className={classes.tableCell}>
                <Amount>{suggestion.originalAmountDue}</Amount>
            </TableCell>
        </TableRow>
    );
};

SendToInvoiceTableRow.propTypes = {
    handleIndividualCheck: PropTypes.func.isRequired,
    selectedOrders: PropTypes.any.isRequired,
    suggestion: PropTypes.object.isRequired,
    includeMeFilter: PropTypes.bool.isRequired,
};

export default SendToInvoiceTableRow;
