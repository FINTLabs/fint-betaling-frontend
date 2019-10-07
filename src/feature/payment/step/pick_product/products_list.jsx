import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import PaymentIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Chip from '@material-ui/core/Chip';
import {Box, makeStyles, Typography} from "@material-ui/core";
import {updateProducts, updateRecipients, updateStep} from "../../../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
        flexDirection: "column",
        alignContent: "center",
        textAlign: "center",
    },
    chipBox: {
        flexDirection: "row",
        alignContent: "center",
    },
    chip: {
        flexDirection: "row",
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
    },
}));

const ProductList = () => {
    const classes = useStyles();
    const productList = useSelector(state => state.payment.payment.products);
    const dispatch = useDispatch();

    function countRecipients(productList) {
        let count = 0;
        const keys = Object.keys(productList);
        keys.map(key => {
            if (productList[key].checked)
                count++;
        })
        return count;
    };

    function handleDelete(key, label) {
        const newArray = {...productList};
        newArray[key] = {"checked": false};
        dispatch(updateProducts(newArray))
    }
    function getTotalPrice(productList) {
        let total = 0;
        const keys = Object.keys(productList);
        keys.map(key => {
            if (productList[key].checked){
                console.log(productList[key].price);
            total = total+ parseInt(productList[key].price);
            }
        })
        return (total/100).toFixed(2);
    }

    const productHeaderText = countRecipients(productList) > 0 ?
        <Typography variant="h6">Valgte produkt:</Typography> : "";


    const productPriceText = countRecipients(productList) > 0 ?
        <Typography variant="h7">Totalt beløp: {getTotalPrice(productList)} </Typography> : "";
    let productListKeys = Object.keys(productList);
    if (productList && Object.keys(productList).length > 0) {
        return (
            <div className={classes.root}>
                {productHeaderText}
                <Box className={classes.chipBox}>
                    {
                        productListKeys.map(key => {
                                if (productList[key].checked) {
                                    return (
                                        <Chip
                                            size="small"
                                            key={key}
                                            value={key}
                                            onDelete={() => handleDelete(key, productList[key].name)}
                                            icon={PaymentIcon}
                                            label={productList[key].name}
                                            className={classes.chip}
                                        >
                                        </Chip>
                                    )
                                }
                            }
                        )
                    }
                </Box>
                {productPriceText}
            </div>
        );
    } else {
        return <div/>
    }
};

export default ProductList;