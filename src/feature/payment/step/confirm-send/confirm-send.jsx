import React from 'react';

import { Box, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ConfirmedRecipients from './confirmed-recipients';
import ConfirmedProducts from './confirmed-products';
import ExpirationDatePicker from './expiration-date-picker';
import { updateNeedFetch, updateLatestSentPayment, updateStep } from '../../../../data/redux/actions/payment';
import ClaimRepository from '../../../../data/repository/ClaimRepository';
import { STEP_PAYMENT_CONFIRMED } from '../../constants';


const ConfirmSend = () => {
    const requestedNumberOfDaysToPaymentDeadLine = useSelector((state) => state.payment.payment.requestedNumberOfDaysToPaymentDeadLine);
    let confirmButtonDisabled = true;
    if (requestedNumberOfDaysToPaymentDeadLine) {
        confirmButtonDisabled = false;
    }
    const dispatch = useDispatch();
    const me = useSelector((state) => state.me.me);
    const schoolName = useSelector((state) => state.payment.payment.school);
    const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const products = useSelector((state) => state.payment.payment.products);
    const productsAmount = useSelector((state) => state.payment.product.amount);
    const customers = useSelector((state) => state.customers.customers);
    const employers = useSelector((state) => state.employers.employers);
    const orgId = 'fake.fintlabs.no';

    function handleSendInvoice() {
        function getRecipientsAsObjects(recipients) {
            const list = [];
            Object.keys(recipients)
                .map((key) => {
                    for (let i = 0; i < customers.length; i++) {
                        const customer = customers[i];
                        if (key === customer.id && recipients[key].checked) {
                            list.push(customer);
                        }
                    }
                    return null;
                });
            return list;
        }

        function getProductsAsObjects(products, productsAmount) {
            const list = [];
            Object.keys(products)
                .map((key) => {
                    if (products[key].checked) {
                        const orderLine = {
                            description: products[key].description,
                            itemQuantity: productsAmount[key].amount,
                            lineitem: {
                                itemCode: key,
                                itemPrice: products[key].itemPrice,
                                taxrate: products[key].taxRate,
                                description: products[key].description,
                                uri: products[key].uri,
                            },
                        };
                        list.push(orderLine);
                    }
                    return null;
                });
            return list;
        }

        const recipientsList = getRecipientsAsObjects(recipients);
        const productList = getProductsAsObjects(products, productsAmount);
        const organisationUnit = {
            name: schoolName,
            organisationNumber: schoolOrgId,
        };

        ClaimRepository.setPayment(
            orgId,
            JSON.parse(JSON.stringify(recipientsList)),
            JSON.parse(JSON.stringify(productList)),
            requestedNumberOfDaysToPaymentDeadLine,
            organisationUnit,
            employers[1],
            me,
        )
            .then((data) => {
                dispatch(updateLatestSentPayment(data));
                dispatch(updateStep(STEP_PAYMENT_CONFIRMED));
                dispatch(updateNeedFetch(true));
            });
    }

    return (
        <Box m={2}>
            <Paper>
                <Box width={1} display="flex" flexDirection="column" alignItems="center">
                    <Box p={2}>
                        <Typography variant="h4">
                            Velg forfall og lagre
                        </Typography>
                    </Box>
                    <Box width={1}>
                        <Divider />
                    </Box>
                    <ConfirmedRecipients />
                    <ConfirmedProducts />
                    <Box width={1} mb={2} display="flex" justifyContent="space-around" alignItems="center">
                        <ExpirationDatePicker />
                        <Button
                            disabled={confirmButtonDisabled}
                            variant="contained"
                            color="secondary"
                            onClick={handleSendInvoice}
                        >
                            Lagre faktura
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ConfirmSend;
