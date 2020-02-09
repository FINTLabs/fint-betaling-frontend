import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Box, makeStyles, Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { grey } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import SelectedToExternalList from './selected_to_external_list';
import Amount from '../utils/amount';
import ClaimRepository from '../../../data/repository/ClaimRepository';
import fetchPayment from '../../../data/redux/actions/payments';
import {
    updateLoadingSendingInvoice,
    updateNeedFetch,
    updateOrderSearchValue,
    updateOrdersOpen,
    updateRedirectFromExternal,
    updateSelectedOrders,
    updateSendOrderResponse,
    updateSentPayment,
} from '../../../data/redux/actions/payment';
import SearchField from '../../../common/search-field';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        alignSelf: 'center',
        margin: 'auto',
        '& .MuiInput-underline:after': {
            content: 'none',
        },
        '& .MuiInput-underline:before': {
            content: 'none',
        },
    },

    clearIcon: {
        color: grey[500],
        cursor: 'pointer',
    },
    h1: {
        margin: theme.spacing(1),
    },
    h2: {
        margin: theme.spacing(1),
    },

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
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
    tableTextChooseAll: {
        fontWeight: 550,
    },
    collapseButton: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        display: 'flex',
        margin: 'auto',
        marginTop: theme.spacing(1),
        width: '100%',
    },
    confirmButton: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: 'auto',
    },
    progress: {
        margin: theme.spacing(2),
        color: theme.palette.secondary.main,
    },

}));

const SendToInvoiceContainer = () => {
    const classes = useStyles();
    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.sendToExternalSystem.searchValue);
    const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const showAll = useSelector((state) => state.payment.sendToExternalSystem.ordersOpen);
    // const latestPayments = useSelector((state) => state.payment.payments.latestSent);
    const me = useSelector((state) => state.me.me);
    const dispatch = useDispatch();
    const suggestions = payments.filter((payment) => payment.claimStatus === 'STORED'
        && payment.createdBy.name === me.name);
    const filteredSuggestions = suggestions.filter((s) => s.orderNumber.includes(searchValue));

    let countOrderFirst = 0;
    const orgId = 'fintlabs.no';

    if (needsFetch) {
        dispatch(fetchPayment());
        dispatch(updateNeedFetch(false));
    }

    function handleIndividualCheck(event) {
        const list = { ...selectedOrders };
        list[event.target.value] = {
            checked: event.target.checked,
        };
        dispatch(updateSelectedOrders(list));
    }

    function handleSearchValue(event) {
        dispatch(updateOrderSearchValue(event.target.value));
        dispatch(updateSentPayment({}));
    }

    function clearSearchValue() {
        dispatch(updateOrderSearchValue(''));
        dispatch(updateSentPayment({}));
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

    function handleConfirmSendPayments() {
        ClaimRepository.sendOrders(
            orgId,
            Object.keys(selectedOrders)
                .filter((key) => selectedOrders[key].checked),
        )
            .then((data) => {
                dispatch(updateSendOrderResponse(data));
                dispatch(updateOrderSearchValue(1));
                dispatch(updateRedirectFromExternal(true));
                dispatch(updateLoadingSendingInvoice(false));
                dispatch(updateNeedFetch(true));
                dispatch(updateSentPayment({}));
            });
        dispatch(updateLoadingSendingInvoice(true));
    }

    function onShowAll() {
        dispatch(updateOrdersOpen(!showAll));
    }

    function getTableRow(suggestion) {
        return (
            <TableRow hover key={suggestion.orderNumber}>
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
    }

    return (
        <Box className={classes.root}>
            <Box
                bgcolor="grey.200"
                borderRadius="borderRadius"
                p={2}
            >
                <Typography variant="h5" className={classes.h1}>
                    Ordre som ikke er sendt til fakturering
                </Typography>
                <Typography variant="body1" className={classes.h1}>
                    Søk på ordrenummer i feltet under
                </Typography>
                <Typography variant="body2" className={classes.h1}>
                    Oversikten viser kun ordrer du har opprettet
                </Typography>
            </Box>
            <Box width={1}>
                <SearchField
                    label="Søk etter ordrenummer"
                    onChange={handleSearchValue}
                    onClear={clearSearchValue}
                    value={searchValue}
                />
            </Box>
            <SelectedToExternalList />
            {Object.keys(selectedOrders)
                .filter((key) => selectedOrders[key].checked).length > 0
                ? (
                    <Button className={classes.confirmButton} onClick={handleConfirmSendPayments}>
                        Send ordre til fakturering
                    </Button>
                )
                : <div />}
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
                        filteredSuggestions.map((suggestion) => {
                            if (filteredSuggestions.length <= 10 || showAll) {
                                return getTableRow(suggestion);
                            }
                            countOrderFirst += 1;
                            if (countOrderFirst <= 10) {
                                return getTableRow(suggestion);
                            }
                            return null;
                        })
                    }
                    {filteredSuggestions.length > 10
                        ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Button className={classes.collapseButton} onClick={onShowAll}>
                                        {!showAll ? 'Vis alle' : 'Vis kun 10 første'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                        : null}
                </TableBody>
            </Table>
        </Box>
    );
};

export default SendToInvoiceContainer;
