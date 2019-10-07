import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core";
import {updateProductSuggestions,} from "../../../../data/redux/actions/payment";
import Box from "@material-ui/core/Box";
import RecipientList from "../pick_recipients/recipient_list";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import ProductSearch from "./product_search";
import ProductList from "./products_list";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: "center"
    },
    formControl: {
        flex: "0 0 25",
        margin: theme.spacing(3),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        "&:enabled": {
            backgroundColor: theme.palette.secondary.main,
        },
        "&:disabled": {},
        margin: theme.spacing(1),
    },
    recipientSearch: {},
}));

const PickProducts = () => {

    const products = useSelector(state => state.orderLines.orderLines);
    const pickedProducts = useSelector(state => state.payment.payment.products);
    const classes = useStyles();
    let confirmButtonDisabled = true;
    const dispatch = useDispatch();

    const keys = Object.keys(pickedProducts);
    for (let productKeyCounter = 0; productKeyCounter < keys.length; productKeyCounter++) {
        if (pickedProducts[keys[productKeyCounter]].checked === true) {
            confirmButtonDisabled = false;
        }
    }

    return (
        <Box classes={classes.root}>
            <RecipientList/>
            <ProductList/>
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <ProductSearch/>

                    <Button disabled={confirmButtonDisabled} variant="outlined" className={classes.confirmButton}>
                        Gå videre
                    </Button>
                </FormControl>
            </form>
        </Box>
    );
}

export default PickProducts;