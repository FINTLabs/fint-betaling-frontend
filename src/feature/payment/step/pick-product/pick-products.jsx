import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import RecipientChipList from '../recipient-chip-list';
import {updateFailedProductForm, updateStep} from '../../../../data/redux/actions/payment';
import ProductSearch from './product-search';
import ProductChipList from './products-chip-list';
import {STEP_CONFIRM_PAYMENT} from '../../constants';

const useStyles = makeStyles((theme) => ({
    h2: {
        textAlign: 'center',
    },
    errorMessage: {
     color: "red",
     marginLeft: theme.spacing(2),
    },
}));

const PickProducts = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const pickedProducts = useSelector((state) => state.payment.payment.products);
    const productAmount = useSelector((state) => state.payment.product.amount);
    const productPrice = useSelector((state) => state.payment.product.itemPrice);
    const failedProductForm = useSelector((state) => state.payment.product.failedProductForm);

    function isConfirmButtonDisabled() {
        return Object.keys(pickedProducts)
            .filter((key) => pickedProducts[key].checked).length === 0;
    }

    function handleOnClickConfirmProducts() {
        let formFilledCorrect = true;
        const keys = Object.keys(pickedProducts);
        keys.filter(key => {
            return pickedProducts[key].checked;
        })
            .map(key => {
                if (productAmount[key] && productPrice[key]) {
                    if (!(productPrice[key].itemPrice && productAmount[key].amount && productPrice[key].itemPrice !== 0 && productAmount[key].amount.toString() !== "0")) {
                        formFilledCorrect = false;
                    }
                } else {
                    formFilledCorrect = false;
                }

            });

        if (formFilledCorrect) {
            dispatch(updateStep(STEP_CONFIRM_PAYMENT));
        } else {
            dispatch(updateFailedProductForm(true));
        }

    }

    return (
        <Box width="90%" mt={4}>
            <Typography variant="h3" className={classes.h2}>Velg produkt</Typography>
            <RecipientChipList/>
            <ProductChipList/>
            <Box mt={4}>
                <FormControl component="fieldset" fullWidth>
                    <ProductSearch/>
                    <Box mt={2} display="flex">
                        <Button
                            disabled={isConfirmButtonDisabled()}
                            variant="contained"
                            color="secondary"
                            onClick={handleOnClickConfirmProducts}
                        >
                            Gå videre
                        </Button>
                        {
                            failedProductForm &&
                            <Typography className={classes.errorMessage}>
                                Et av produktene mangler pris eller har 0 i antall
                            </Typography>
                        }
                    </Box>
                </FormControl>
            </Box>
        </Box>
    );
};

export default PickProducts;
