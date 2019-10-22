import React from 'react';
import {Box, makeStyles, Paper} from "@material-ui/core";
import ConfirmedRecipients from "./confirmed_recipients";
import ConfirmedProducts from "./confirmed_products";
import ExpirationDatePicker from "./expiration_date_picker";
import Button from "@material-ui/core/Button";
import {useDispatch, useSelector} from "react-redux";
import {fetchPayment} from "../../../../data/redux/actions/payments";
import {updateStep} from "../../../../data/redux/actions/payment";
import Typography from "@material-ui/core/Typography";
import PaymentRepository from "../../../../data/repository/PaymentRepository";
import {STEP_PAYMENT_CONFIRMED} from "../../constants";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexBasis: "250px",
        justifyContent: 'center',
        padding: theme.spacing(0.5),
        alignContent: "center",
        textAlign: "center",
        flex: "0 0 25rem",
        flexDirection: "column",

    },
    confirmPaper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1),
    },
    expirationContainer: {
        alignSelf: "flex-end",
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        "&:enabled": {
            backgroundColor: theme.palette.secondary.main,
        },
        "&:disabled": {},
        verticalAlign: "bottom",
        margin: theme.spacing(2),
    },
    titleText: {
        color: theme.palette.secondary.main,
    },
}));

const ConfirmSend = () => {
    const classes = useStyles();
    const expirationDate = useSelector(state => state.payment.payment.expirationDate);
    let confirmButtonDisabled = true;
    if (expirationDate)
        confirmButtonDisabled = false;
    const dispatch = useDispatch();
    const recipients = useSelector(state => state.payment.payment.recipients);
    const products = useSelector(state => state.payment.payment.products);
    const productsAmount = useSelector(state => state.payment.product.amount);
    const customers = useSelector(state => state.customers.customers);
    const orderLines = useSelector(state => state.orderLines.orderLines);
    const mva = useSelector(state => state.mva.mva);
    const employer = useSelector(state => state.employers.employers);
    const orgId = "fintlabs.no";

    function handleSendInvoice() {
        function getRecipientsAsObjects(recipients) {
            let list = [];
            Object.keys(recipients).map(key => {
                for (let i = 0; i < customers.length; i++) {
                    const customer = customers[i];
                    if (key === customer.kundenummer) {
                        console.log(i + ". " + key);
                        list.push(customer);
                    }
                }
            });
            return list;
        }

        function getProductsAsObjects(products, productsAmount) {
            let list = [];
            let orderLineFromProducts;
            Object.keys(products).map(key => {
                for (let i = 0; i < orderLines.length; i++) {
                    if (orderLines[i].kode === key) {
                        orderLineFromProducts = orderLines[i];
                        console.log(i + ". " + orderLines[i]);
                    }
                }
                const orderLine = {
                    amount: productsAmount[key].amount,
                    description: products[key].name,
                    orderLine: orderLineFromProducts,
                };
                list.push(orderLine);

            });
            console.log("list: ", list);
            return list;
        }


        const recipientsList = getRecipientsAsObjects(recipients);

        const productList = getProductsAsObjects(products, productsAmount);

        console.log("SENDER INN PAYMENT: ", orgId,
            JSON.parse(JSON.stringify(recipientsList)),
            JSON.parse(JSON.stringify(productList)),
            mva[0],
            employer[0],
            expirationDate)

        PaymentRepository.setPayment(
            orgId,
            JSON.parse(JSON.stringify(recipientsList)),
            JSON.parse(JSON.stringify(productList)),
            mva[0],
            employer[0],
            expirationDate
        ).then(data => {
            console.log(data);
            dispatch(updateStep(STEP_PAYMENT_CONFIRMED));
            dispatch(fetchPayment());
        });
    }

    return (
        <Box className={classes.root}>
            <Paper>
                <Typography variant="h4" className={classes.titleText}>
                    Velg forfall og send
                </Typography>
            </Paper>
            <Paper className={classes.confirmPaper}>
                <ConfirmedRecipients/>
                <ConfirmedProducts/>
                <Box className={classes.expirationContainer}>
                    <ExpirationDatePicker/>
                    <Button disabled={confirmButtonDisabled} className={classes.confirmButton}
                            onClick={handleSendInvoice}>Send fakturaer</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ConfirmSend;