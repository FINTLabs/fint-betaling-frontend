import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { ORDER_NUMBER } from '../payment/constants';
import { updateSearchPage } from '../../data/redux/actions/payment';
import Amount from '../payment/utils/amount';
import Pagination from '../../common/pagination';
import SearchHighlighter from '../../common/search-highlighter';
import PaymentStatusIcon from './payment-status-icon';
import PaymentStatusMessageDialog from './payment-status-message-dialog';

const useStyles = makeStyles(() => ({
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellStatus: {
        wordWrap: 'break-word',
        display: 'flex',
    },
}));

const PaymentsTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const query = useSelector((state) => state.payment.payments.searchValue);
    const searchBy = useSelector((state) => state.payment.payments.searchBy)
        .toString();
    const activePage = useSelector((state) => state.payment.form.page);
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const suggestionsLength = query.length === 0 ? 0 : suggestionLengthTemp;
    const suggestionTemp = useSelector((state) => state.payment.payments.filteredSuggestions);
    const suggestions = query.length === 0
        ? []
        : suggestionTemp;

    const handleChangePage = (event, newPage) => {
        dispatch(updateSearchPage(newPage));
    };

    if (query.length < 1) {
        return <div />;
    }
    return (
        <Box mt={1}>
            <PaymentStatusMessageDialog />
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="left" className={classes.tableCell}>Navn</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Ordrenummer</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Fakturanummer</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Netto totalpris</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Å betale</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        suggestions.map(
                            (suggestion) => (
                                <TableRow hover key={suggestion.orderNumber}>
                                    <TableCell align="left" className={classes.tableCellStatus}>
                                        <PaymentStatusIcon payment={suggestion} />
                                    </TableCell>
                                    <TableCell align="left" className={classes.tableCell}>
                                        {searchBy === ORDER_NUMBER
                                            ? suggestion.customer.name
                                            : (
                                                <SearchHighlighter
                                                    value={suggestion.customer.name}
                                                    query={query}
                                                />
                                            )}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {searchBy === ORDER_NUMBER
                                            ? (
                                                <SearchHighlighter
                                                    value={suggestion.orderNumber.toString()}
                                                    query={query}
                                                />
                                            )
                                            : suggestion.orderNumber}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.invoiceNumbers}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <Amount>{suggestion.originalAmountDue}</Amount>
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <Amount>{suggestion.amountDue}</Amount>
                                    </TableCell>
                                </TableRow>
                            ),
                        )
                    }
                </TableBody>
            </Table>
            <Pagination
                activePage={activePage}
                handleChangePage={handleChangePage}
                suggestionsLength={suggestionsLength}
            />
        </Box>
    );
};

export default PaymentsTable;
