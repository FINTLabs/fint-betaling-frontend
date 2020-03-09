import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import RecipientChipList from '../recipient-chip-list';
import { updateStep } from '../../../../data/redux/actions/payment';
import ProductSearch from './product-search';
import ProductChipList from './products-chip-list';
import { STEP_CONFIRM_PAYMENT } from '../../constants';

const useStyles = makeStyles(() => ({
    h2: {
        textAlign: 'center',
    },
}));

const PickProducts = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const pickedProducts = useSelector((state) => state.payment.payment.products);

    useEffect(() => {
        //dispatch(fetchOrderLines());
    }, [dispatch]);

    function isConfirmButtonDisabled() {
        return Object.keys(pickedProducts)
            .filter((key) => pickedProducts[key].checked).length === 0;
    }

    function handleOnClickConfirmProducts() {
        dispatch(updateStep(STEP_CONFIRM_PAYMENT));
    }

    return (
        <Box width="90%" mt={4}>
            <Typography variant="h3" className={classes.h2}>Velg produkt</Typography>
            <RecipientChipList />
            <ProductChipList />
            <Box mt={4}>
                <FormControl component="fieldset" fullWidth>
                    <ProductSearch />
                    <Box mt={2}>
                        <Button
                            disabled={isConfirmButtonDisabled()}
                            variant="contained"
                            color="secondary"
                            onClick={handleOnClickConfirmProducts}
                        >
                            Gå videre
                        </Button>
                    </Box>
                </FormControl>
            </Box>
        </Box>
    );
};

export default PickProducts;
