import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, Paper, Typography,} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    updateLoadingSendingInvoice,
    updateNeedFetch,
    updateOrderSearchValue,
    updateOrdersOpen,
    updateRedirectFromExternal,
    updateSelectedOrders,
    updateSendOrderResponse, updateSentPayment,
} from '../../../data/redux/actions/payment';
import SelectedToExternalList from './selected_to_external_list';
import {fetchPayment} from '../../../data/redux/actions/payments';
import {Redirect} from 'react-router-dom';
import ClaimRepository from "../../../data/repository/ClaimRepository";
import Amount from "../utils/amount";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        alignSelf: 'center',
        margin: 'auto',
        '& .MuiInput-underline:after': {
            content: "none"
        },
        '& .MuiInput-underline:before': {
            content: "none"
        },
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    h1: {
        margin: theme.spacing(1),
    },
    h2: {
        margin: theme.spacing(1),
    },
    searchContainer: {
        display: "flex",
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
        width: "100%"
    },
    confirmButton: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: "auto",
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
    const displayLoading = useSelector((state) => state.payment.sendToExternalSystem.loading);
    const redirected = useSelector((state) => state.payment.sendToExternalSystem.redirect);
    const needsFetch = useSelector(state => state.payment.sendToExternalSystem.needFetch);
    const openCollapse = useSelector(state => state.payment.sendToExternalSystem.ordersOpen);
    const latestPayments = useSelector((state) => state.payment.payments.latestSent);
    const me = useSelector(state => state.me.me);
    const dispatch = useDispatch();
    const suggestions = getNotSentPayments();
    const filteredSuggestions = getFilteredSuggestions();
    let countOrderFirst = 0;
    const orgId = 'fake.fintlabs.no';

    if (needsFetch) {
        dispatch(fetchPayment());
        dispatch(updateNeedFetch(false));
    }

    function getNotSentPayments() {
        const array = [];
        if (payments) {
            for (let index = 0; index < payments.length; index++) {
                if (payments[index].claimStatus === "STORED" && me.name === payments[index].createdBy.name) {
                    array.push(payments[index]);
                }
            }
        }
        return array;
    }

    function getFilteredSuggestions() {
        if (latestPayments && latestPayments.length >0){
            return latestPayments;
        }
        const array = [];
        for (let index = 0; index < suggestions.length; index++) {
            if (suggestions[index].orderNumber.includes(searchValue)) {
                array.push(suggestions[index]);
            }
        }
        return array;
    }

    function handleIndividualCheck(event) {
        const newArray = {...selectedOrders};
        newArray[event.target.value] = {
            checked: event.target.checked,
        };
        dispatch(updateSelectedOrders(newArray));
    }

    function handleChange(event) {
        dispatch(updateOrderSearchValue(event.target.value));
        dispatch(updateSentPayment({}));
    }

    function isAllChecked() {
        let allChecked = true;
        if (filteredSuggestions.length === 0 || Object.keys(selectedOrders).length === 0) {
            return allChecked = false;
        }
        for (let index = 0; index < filteredSuggestions.length; index++) {
            if (!openCollapse && index >= 10) {
                continue;
            }
            const orderNumber = filteredSuggestions[index].orderNumber.toString();
            let displayedOrderIsInSelectedOrders = false;
            Object.keys(selectedOrders)
                .filter(key => key === orderNumber).forEach(() => {
                displayedOrderIsInSelectedOrders = true;
            });
            if (!displayedOrderIsInSelectedOrders || !selectedOrders[orderNumber].checked) {
                allChecked = false;
            }
        }
        return allChecked;
    }

    function handleAllChecked(event) {
        const newArray = {...selectedOrders};
        for (let index = 0; index < filteredSuggestions.length; index++) {
            if (!openCollapse && index >= 10) {
                continue;
            }
            newArray[filteredSuggestions[index].orderNumber] = {
                checked: event.target.checked,
            };
        }
        dispatch(updateSelectedOrders(newArray));
    }

    function handleConfirmSendPayments() {
        const orderNumbers = [];
        Object.keys(selectedOrders)
            .filter(key => selectedOrders[key].checked).map(key => {
            orderNumbers.push(key);
            return null;
        });
        ClaimRepository.sendOrders(
            orgId,
            orderNumbers,
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

    function handleCollapse() {
        dispatch(updateOrdersOpen(!openCollapse));
    }

    function getSuggestionsAsTableCell(suggestion) {
        return (
            <TableRow hover key={suggestion.orderNumber}>
                <TableCell align="left" className={classes.tableCell}>
                    {suggestion.orderNumber}
                </TableCell>
                <TableCell align="right" className={classes.tableCell}>
                    {suggestion.customer
                        ? suggestion.customer.name
                            ? suggestion.customer.name
                            : '' : ''}
                </TableCell>
                <TableCell align="right" className={classes.tableCell}>
                    {suggestion.originalAmountDue
                        ? Amount.currency(suggestion.originalAmountDue) : ''}
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                    <Checkbox
                        checked={selectedOrders[suggestion.orderNumber] ? selectedOrders[suggestion.orderNumber].checked : false}
                        onChange={handleIndividualCheck}
                        value={suggestion.orderNumber}
                    />
                </TableCell>
            </TableRow>)
    }

    return (
        <Box className={classes.root}>
            <Paper>
                <Typography variant="h5" className={classes.h1}>
                    Ordre som ikke er sendt til
                    fakturering
                </Typography>
                <Typography variant="body1" className={classes.h1}>Filtrer på ordrenummer i feltene under</Typography>
                <Typography variant="body1" className={classes.h1}>Oversikten viser kun ordrer du har
                    opprettet</Typography>
                <Box className={classes.searchContainer}>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="standard-name"
                            label="Søk etter ordrenummer"
                            className={classes.textField}
                            value={searchValue}
                            onChange={handleChange}
                            margin="normal"
                            type="number"
                        />
                    </form>
                </Box>
            </Paper>
            <SelectedToExternalList/>
            {Object.keys(selectedOrders).length > 0
                ? !displayLoading
                    ? (
                        <Button className={classes.confirmButton} onClick={handleConfirmSendPayments}>
                            Send ordre til fakturering
                        </Button>
                    )
                    : <CircularProgress className={classes.progress}/> : <div/>}
            {redirected ? <Redirect to="/ordre-sendt"/> : <div/>}
            <Table className={classes.table} size="small">
                <TableHead>
                    {filteredSuggestions.length > 0
                        ? (
                            <TableRow>
                                <TableCell>Ordrenummer</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
                                <TableCell align="center" className={classes.tableCell}>Velg</TableCell>
                            </TableRow>
                        )
                        : <TableRow/>}

                </TableHead>
                <TableBody>
                    {
                        filteredSuggestions.map((suggestion) => {
                                if (filteredSuggestions.length <= 10 || openCollapse) {
                                    return getSuggestionsAsTableCell(suggestion);
                                } else {
                                    countOrderFirst += 1;
                                    if (countOrderFirst <= 10) {
                                        return getSuggestionsAsTableCell(suggestion);
                                    }
                                    return null
                                }
                            }
                        )
                    }
                    {filteredSuggestions.length > 10 ?
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Button className={classes.collapseButton} onClick={handleCollapse}>
                                    {!openCollapse ? "Vis alle" : "Vis kun 10 første"}
                                </Button>
                            </TableCell>
                        </TableRow>
                        : null
                    }
                    {filteredSuggestions.length > 0 ?
                        (
                            <TableRow>
                                <TableCell align="center" className={classes.tableCell} colSpan="2"/>
                                <TableCell align="right" className={classes.tableCell}>
                                    <Typography className={classes.tableTextChooseAll}>Velg alle:</Typography>
                                </TableCell>
                                <TableCell align="center" className={classes.tableCell}>
                                    <Checkbox
                                        checked={isAllChecked()}
                                        onChange={handleAllChecked}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                        : <TableRow/>}

                </TableBody>
            </Table>
        </Box>
    );
};

export default SendToInvoiceContainer;
