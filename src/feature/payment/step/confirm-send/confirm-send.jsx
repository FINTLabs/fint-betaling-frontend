import React, { useState } from 'react';

import { Box, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ConfirmedRecipients from './confirmed-recipients';
import ConfirmedProducts from './confirmed-products';
import { updateLatestSentPayment, updateNeedFetch, updateStep } from '../../../../data/redux/actions/payment';
import ClaimRepository from '../../../../data/repository/ClaimRepository';
import { STEP_PAYMENT_CONFIRMED, STEP_PICK_PRODUCTS } from '../../constants';

const ConfirmSend = () => {
    const dispatch = useDispatch();
    const me = useSelector((state) => state.me.me);
    const schoolName = useSelector((state) => state.payment.payment.school);
    const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const products = useSelector((state) => state.payment.payment.products);
    const productsAmount = useSelector((state) => state.payment.product.amount);
    const productsPrice = useSelector((state) => state.payment.product.itemPrice);
    const productsDescription = useSelector((state) => state.payment.product.description);
    const customers = useSelector((state) => state.customers.customers);
    const principal = useSelector((state) => state.principal.principal);
    // Todo: Do we need this if we redirect to payment confirmed immediately?
    const [isClaimSent, setIsClaimSent] = useState(false);
    const orgId = 'fake.fintlabs.no';

    const handleSendInvoice = () => {
        function getRecipientsAsObjects(recipientsX) {
            const list = [];
            Object.keys(recipientsX)
                .map((key) => {
                    for (let i = 0; i < customers.length; i += 1) {
                        const customer = customers[i];
                        if (key === customer.id && recipientsX[key].checked) {
                            list.push(customer);
                        }
                    }
                    return null;
                });
            return list;
        }

        function getProductsAsObjects(productsX, amount, price, description) {
            const list = [];
            Object.keys(productsX)
                .map((key) => {
                    if (productsX[key].checked) {
                        const orderLine = {
                            description: description ? description[key].description : '',
                            itemQuantity: amount[key].amount,
                            itemPrice: price[key].itemPrice,
                            lineitem: {
                                itemCode: key,
                                itemPrice: productsX[key].itemPrice,
                                taxrate: productsX[key].taxRate,
                                description: productsX[key].description,
                                uri: productsX[key].uri,
                            },
                        };
                        list.push(orderLine);
                    }
                    return null;
                });
            return list;
        }

        const recipientsList = getRecipientsAsObjects(recipients);
        const productList = getProductsAsObjects(products, productsAmount, productsPrice, productsDescription);
        const organisationUnit = {
            name: schoolName,
            organisationNumber: schoolOrgId,
        };

        setIsClaimSent(true);

        ClaimRepository.setPayment(
            orgId,
            JSON.parse(JSON.stringify(recipientsList)),
            JSON.parse(JSON.stringify(productList)),
            organisationUnit,
            principal,
            me,
        )
            .then((data) => {
                dispatch(updateStep(STEP_PAYMENT_CONFIRMED));
                dispatch(updateLatestSentPayment(data));
                dispatch(updateNeedFetch(true));
            });
    };

    const handleBackwardClick = () => {
        dispatch(updateStep(STEP_PICK_PRODUCTS));
    };

    return (
        <Box width={1} m={2}>
            <Paper>
                <Box width={1} display="flex" flexDirection="column" alignItems="center">
                    <Box p={2}>
                        <Typography variant="h4">
                            Lagre betaling
                        </Typography>
                    </Box>
                    <Box width={1}>
                        <Divider />
                    </Box>
                    <ConfirmedRecipients />
                    <ConfirmedProducts />
                    <Box
                        width={1}
                        mb={2}
                        pl={2}
                        pr={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBackwardClick}
                        >
                            Tilbake
                        </Button>
                        <Button
                            disabled={isClaimSent}
                            variant="contained"
                            color="secondary"
                            onClick={handleSendInvoice}
                        >
                            Lagre betaling
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ConfirmSend;
