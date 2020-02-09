import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrdersOpen, updateSelectedOrders } from '../../../data/redux/actions/payment';
import SendToInvoiceTableRow from './send-to-invoice-table-row';

const useStyles = makeStyles(() => ({
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
}));

const SendToInvoiceTable = ({ filteredSuggestions, selectedOrders }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showAll = useSelector((state) => state.payment.sendToExternalSystem.ordersOpen);

    function handleIndividualCheck(event) {
        const list = { ...selectedOrders };
        list[event.target.value] = {
            checked: event.target.checked,
        };
        dispatch(updateSelectedOrders(list));
    }

    function displayedOrderIsInSelectedOrders(orderNumber) {
        return Object.keys(selectedOrders)
            .filter((key) => key === orderNumber).length > 0;
    }

    function isAllChecked() {
        let allChecked = true;

        filteredSuggestions.forEach((v, i) => {
            if (!(!showAll && i >= 10)) {
                if (!displayedOrderIsInSelectedOrders(v.orderNumber) || !selectedOrders[v.orderNumber].checked) {
                    allChecked = false;
                }
            }
        });

        return allChecked;
    }

    function handleAllChecked(event) {
        const list = { ...selectedOrders };
        for (let i = 0; i < filteredSuggestions.length; i += 1) {
            if (!(!showAll && i >= 10)) {
                list[filteredSuggestions[i].orderNumber] = {
                    checked: event.target.checked,
                };
            }
        }
        dispatch(updateSelectedOrders(list));
    }

    function onShowAll() {
        dispatch(updateOrdersOpen(!showAll));
    }

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                {filteredSuggestions.length > 0
                    ? (
                        <>
                            <TableRow>
                                <TableCell align="right" colSpan="3" />
                                <TableCell align="center" className={classes.tableCell}>
                                    <Checkbox
                                        checked={isAllChecked()}
                                        onChange={handleAllChecked}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Ordrenummer</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
                                <TableCell align="center" className={classes.tableCell}>Velg</TableCell>
                            </TableRow>
                        </>
                    )
                    : <TableRow />}

            </TableHead>
            <TableBody>
                {
                    filteredSuggestions
                        .slice(0, showAll ? filteredSuggestions.length : 10)
                        .map((suggestion) => (
                            <SendToInvoiceTableRow
                                key={suggestion.orderNumber}
                                handleIndividualCheck={handleIndividualCheck}
                                selectedOrders={selectedOrders}
                                suggestion={suggestion}
                            />
                        ))
                }
                {filteredSuggestions.length > 10
                    ? (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Button fullWidth onClick={onShowAll}>
                                    {!showAll ? 'Vis alle' : 'Vis kun 10 første'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                    : null}
            </TableBody>
        </Table>
    );
};


SendToInvoiceTable.propTypes = {
    filteredSuggestions: PropTypes.array.isRequired,
    selectedOrders: PropTypes.array.isRequired,
};

export default SendToInvoiceTable;
