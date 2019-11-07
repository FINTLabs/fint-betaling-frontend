import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {
  Box, makeStyles, Paper, Typography,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  updateFromValue,
  updateLoadingSendingInvoice,
  updateNeedFetch,
  updateRedirectFromExternal,
  updateSelectedOrders,
  updateSendOrderResponse,
  updateToValue,
} from '../../../data/redux/actions/payment';
import SelectedToExternalList from './selected_to_external_list';
import InvoiceRepository from '../../../data/repository/InvoiceRepository';
import { fetchPayment } from '../../../data/redux/actions/payments';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    alignSelf: 'center',
    margin: 'auto',
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
  confirmButton: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    margin: 'auto',
    marginTop: theme.spacing(1),
  },
  progress: {
    margin: theme.spacing(2),
    color: theme.palette.secondary.main,
  },

}));

const SendToInvoiceContainer = () => {
  const classes = useStyles();
  const payments = useSelector((state) => state.payments.payments);
  const fromValue = useSelector((state) => state.payment.sendToExternalSystem.fromValue);
  const toValue = useSelector((state) => state.payment.sendToExternalSystem.toValue);
  const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
  const displayLoading = useSelector((state) => state.payment.sendToExternalSystem.loading);
  const redirected = useSelector((state) => state.payment.sendToExternalSystem.redirect);
    const latestPayments = useSelector(state => state.payment.payments.latestSent);
    const needsFetch = useSelector(state => state.payment.sendToExternalSystem.needFetch);
  const dispatch = useDispatch();
  const suggestions = getNotSentPayments();
  const filteredSuggestions = getFilteredSuggestions();
  const orgId = 'fintlabs.no';

  if (needsFetch) {
    dispatch(fetchPayment());
    dispatch(updateNeedFetch(false));
  }

  console.log('suggestions: ', suggestions);
  console.log('filteredSuggestions: ', filteredSuggestions);

  function getNotSentPayments() {
    console.log(payments);
    const array = [];
    if (payments) {
      for (let index = 0; index < payments.length; index++) {
        if (payments[index].claimStatus === "STORED") {
          array.push(payments[index]);
        }
      }
    }
    return array;
  }

  function getFilteredSuggestions() {
    const array = [];
    for (let index = 0; index < suggestions.length; index++) {
      if (suggestions[index].orderNumber >= parseInt(fromValue.toString()) && suggestions[index].orderNumber <= parseInt(toValue.toString())) {
        array.push(suggestions[index]);
      }
    }
    return array;
  }

  function handleIndividualCheck(event) {
    const newArray = { ...selectedOrders };
    newArray[event.target.value] = {
      checked: event.target.checked,
    };
    dispatch(updateSelectedOrders(newArray));
  }

  function handleFromChange(event) {
    dispatch(updateFromValue(event.target.value));
  }

  function handleToChange(event) {
    dispatch(updateToValue(event.target.value));
  }

  function isAllChecked() {
    let allChecked = true;
    if (filteredSuggestions.length === 0 || Object.keys(selectedOrders).length === 0) {
      return allChecked = false;
    }
    for (let index = 0; index < filteredSuggestions.length; index++) {
      console.log(filteredSuggestions[index]);
      const orderNumber = filteredSuggestions[index].orderNumber.toString();
      let displayedOrderIsInSelectedOrders = false;
      Object.keys(selectedOrders)
        .map((key) => {
          if (key === orderNumber) {
            displayedOrderIsInSelectedOrders = true;
          }
        });
      if (!displayedOrderIsInSelectedOrders || !selectedOrders[orderNumber].checked) {
        allChecked = false;
      }
    }
    return allChecked;
  }

  function handleAllChecked(event) {
    const newArray = { ...selectedOrders };
    for (let index = 0; index < filteredSuggestions.length; index++) {
      newArray[filteredSuggestions[index].orderNumber] = {
        checked: event.target.checked,
      };
    }
    dispatch(updateSelectedOrders(newArray));
  }

  function handleConfirmSendPayments() {
    const orderNumbers = [];
    Object.keys(selectedOrders)
      .map((key) => {
        if (selectedOrders[key].checked) {
          orderNumbers.push(key);
        }
      });
    InvoiceRepository.sendOrders(
      orgId,
      orderNumbers,
    )
      .then((data) => {
        console.log('data: ', data);
        dispatch(updateSendOrderResponse(data));
            dispatch(updateFromValue(fromValue));
            dispatch(updateToValue(toValue));
        dispatch(updateRedirectFromExternal(true));
        dispatch(updateLoadingSendingInvoice(false));
        dispatch(updateNeedFetch(true));
      });
    dispatch(updateLoadingSendingInvoice(true));
  }

  return (
    <Box className={classes.root}>
      <Paper>
        <Typography variant="h5" className={classes.h1}>
          Ordre som ikke er sendt til
          økonomisystem
        </Typography>
        <Typography variant="body1" className={classes.h1}>Filtrer på ordrenummer i feltene under</Typography>
        <form className={classes.container} noValidate>
          <TextField
            id="standard-name"
            label="Fra ordrenummer"
            className={classes.textField}
            value={fromValue}
            onChange={handleFromChange}
            margin="normal"
            type="number"
          />
          <TextField
            id="standard-name"
            label="Til ordrenummer"
            className={classes.textField}
            value={toValue}
            onChange={handleToChange}
            margin="normal"
            type="number"
          />
        </form>
      </Paper>
      <SelectedToExternalList />
      <Table className={classes.table} size="small">
        <TableHead>
          {filteredSuggestions.length > 0
            ? (
              <TableRow>
                <TableCell>Ordrenummer</TableCell>
                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
                <TableCell align="right" className={classes.tableCell}>Velg</TableCell>
              </TableRow>
            )
            : <div />}

        </TableHead>
        <TableBody>
          {
            filteredSuggestions.map(
              (suggestion) => (
                <TableRow hover>
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
                    {suggestion.restBelop
                      ? (parseInt(suggestion.restBelop) / 100).toFixed(2) : ''}
                  </TableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    <Checkbox
                      checked={selectedOrders[suggestion.orderNumber] ? selectedOrders[suggestion.orderNumber].checked : false}
                      onChange={handleIndividualCheck}
                      value={suggestion.orderNumber}
                    />
                  </TableCell>
                </TableRow>
              ),
            )
          }
          {filteredSuggestions.length > 0
            ? (
              <TableRow>
                <TableCell align="center" className={classes.tableCell} colSpan="2" />
                <TableCell align="right" className={classes.tableCell}>
                  <Typography className={classes.tableTextChooseAll}>Velg alle i listen:</Typography>
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <Checkbox
                    checked={isAllChecked()}
                    onChange={handleAllChecked}
                  />
                </TableCell>
              </TableRow>
            )
            : <div />}

        </TableBody>
      </Table>
      {Object.keys(selectedOrders).length > 0
        ? !displayLoading
          ? (
            <Button className={classes.confirmButton} onClick={handleConfirmSendPayments}>
              Send til økonomisystem
            </Button>
          )
          : <CircularProgress className={classes.progress} /> : <div />}
      {redirected ? <Redirect to="/betaling-sendt" /> : <div />}
    </Box>
  );
};

export default SendToInvoiceContainer;
