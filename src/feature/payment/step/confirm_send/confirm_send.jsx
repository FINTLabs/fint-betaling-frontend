import React from 'react';

import { Box, makeStyles, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ConfirmedRecipients from './confirmed_recipients';
import ConfirmedProducts from './confirmed_products';
import ExpirationDatePicker from './expiration_date_picker';
import { updateNeedFetch, updateSentPayment, updateStep } from '../../../../data/redux/actions/payment';
import ClaimRepository from '../../../../data/repository/ClaimRepository';
import { STEP_PAYMENT_CONFIRMED } from '../../constants';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexBasis: '250px',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    alignContent: 'center',
    textAlign: 'center',
    flex: '0 0 25rem',
    flexDirection: 'column',

  },
  confirmPaper: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
  },
  expirationContainer: {
    alignSelf: 'flex-end',
  },
  confirmButton: {
    color: theme.palette.secondary.contrastText,
    '&:enabled': {
      backgroundColor: theme.palette.secondary.main,
    },
    '&:disabled': {},
    verticalAlign: 'bottom',
    margin: theme.spacing(2),
  },
  titleText: {
    color: theme.palette.secondary.main,
  },
}));

const ConfirmSend = () => {
  const classes = useStyles();
  const expirationDate = useSelector((state) => state.payment.payment.expirationDate);
  let confirmButtonDisabled = true;
  if (expirationDate) {
    confirmButtonDisabled = false;
  }
  const dispatch = useDispatch();
  const recipients = useSelector((state) => state.payment.payment.recipients);
  const products = useSelector((state) => state.payment.payment.products);
  const productsAmount = useSelector((state) => state.payment.product.amount);
  const customers = useSelector((state) => state.customers.customers);
  const orderLines = useSelector((state) => state.orderLines.orderLines);
  const mva = useSelector((state) => state.mva.mva);
  const employer = useSelector((state) => state.employers.employers);
  const orgId = 'fake.fintlabs.no';


  function handleSendInvoice() {
    function getRecipientsAsObjects(recipients) {
      const list = [];
      Object.keys(recipients)
        .map((key) => {
          for (let i = 0; i < customers.length; i++) {
            const customer = customers[i];
            if (key === customer.id) {
              list.push(customer);
            }
          }
        });
      return list;
    }

    function getProductsAsObjects(products, productsAmount) {
      const list = [];
      let orderLineFromProducts;
      Object.keys(products)
        .map((key) => {
          for (let i = 0; i < orderLines.length; i++) {
            if (orderLines[i].kode === key) {
              orderLineFromProducts = orderLines[i];
            }
          }
          const orderLine = {
            itemUri: products[key].uri,
            description: products[key].name,
            numberOfItems: productsAmount[key].amount,
            itemPrice: products[key].price,
          };
          list.push(orderLine);
        });
      return list;
    }


    const recipientsList = getRecipientsAsObjects(recipients);

    const productList = getProductsAsObjects(products, productsAmount);
    ClaimRepository.setPayment(
      orgId,
      JSON.parse(JSON.stringify(recipientsList)),
      JSON.parse(JSON.stringify(productList)),
      employer[1]._links.self[0].href,
      expirationDate,
    )
      .then((data) => {
        console.log("BACK END RESPONSE: ", data);
        dispatch(updateSentPayment(data));
        dispatch(updateStep(STEP_PAYMENT_CONFIRMED));
        dispatch(updateNeedFetch(true));
      });
  }

  return (
    <Box className={classes.root}>
      <Paper>
        <Typography variant="h4" className={classes.titleText}>
          Velg forfall og lagre
        </Typography>
      </Paper>
      <Paper className={classes.confirmPaper}>
        <ConfirmedRecipients />
        <ConfirmedProducts />
        <Box className={classes.expirationContainer}>
          <ExpirationDatePicker />
          <Button
            disabled={confirmButtonDisabled}
            className={classes.confirmButton}
            onClick={handleSendInvoice}
          >
            Lagre faktura
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConfirmSend;
