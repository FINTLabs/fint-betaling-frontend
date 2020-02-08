import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import RecipientChipList from '../recipient-chip-list';
import {updateStep} from '../../../../data/redux/actions/payment';
import ProductSearch from './product_search';
import ProductList from './products_list';
import {STEP_CONFIRM_PAYMENT} from '../../constants';

const useStyles = makeStyles((theme) => ({
    root: {},
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    h2:{
        textAlign: "center",
    },
    formControl: {
        minWidth:"70%",
        maxWidth:"70%",
        margin: theme.spacing(3),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        '&:enabled': {
            backgroundColor: theme.palette.secondary.main,
        },
        '&:disabled': {},
        margin: theme.spacing(1),
    },
    recipientSearch: {},
}));

const PickProducts = () => {
    const pickedProducts = useSelector((state) => state.payment.payment.products);
    const classes = useStyles();
    let confirmButtonDisabled = true;
    const dispatch = useDispatch();
    const keys = Object.keys(pickedProducts);

    for (let productKeyCounter = 0; productKeyCounter < keys.length; productKeyCounter++) {
        if (pickedProducts[keys[productKeyCounter]].checked === true) {
            confirmButtonDisabled = false;
        }
    }

    function handleOnClickConfirmProducts() {
        dispatch(updateStep(STEP_CONFIRM_PAYMENT));
    }

    return (
        <Box className={classes.root}>
            <Typography variant={"h3"} className={classes.h2}>Velg produkt</Typography>
            <RecipientChipList/>
            <ProductList/>
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <ProductSearch/>

                    <Button
                        disabled={confirmButtonDisabled}
                        variant="outlined"
                        className={classes.confirmButton}
                        onClick={handleOnClickConfirmProducts}
                    >
                        Gå videre
                    </Button>
                </FormControl>
            </form>
        </Box>
    );
};

export default PickProducts;
