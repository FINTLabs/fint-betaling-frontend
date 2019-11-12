import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Chip from '@material-ui/core/Chip';
import {Box, makeStyles, Typography} from '@material-ui/core';
import {updateProducts} from '../../../../data/redux/actions/payment';
import {countChecked, getTotalPrice} from '../../utils/list_utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
        flexDirection: 'column',
        alignContent: 'center',
        textAlign: 'center',
    },
    chipBox: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    chip: {
        flexDirection: 'row',
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
    },
}));

const ProductList = () => {
    const classes = useStyles();
    const productList = useSelector((state) => state.payment.payment.products);
    const productAmount = useSelector((state) => state.payment.product.amount);
    const dispatch = useDispatch();
    const productListKeys = Object.keys(productList);
    const productHeaderText = countChecked(productList) > 0
        ? <Typography variant="h6">Valgte produkt:</Typography> : '';
    const productPriceText = countChecked(productList) > 0
        ? (
            <Typography>
                Total beløp per
                mottaker:
                {getTotalPrice(productList, productAmount)}
            </Typography>
        ) : '';

    function handleDelete(key) {
        const newArray = {...productList};
        newArray[key] = {checked: false};
        dispatch(updateProducts(newArray));
    }

    if (productList && Object.keys(productList).length > 0) {
        return (
            <div className={classes.root}>
                {productHeaderText}
                <Box className={classes.chipBox}>
                    {
                        productListKeys.filter(key => productList[key].checked).map(key => {
                            const labelText = `${productList[key].name} x${productAmount[key].amount}`;
                            return (
                                <Chip
                                    size="small"
                                    key={key}
                                    value={key}
                                    onDelete={() => handleDelete(key)}
                                    label={labelText}
                                    className={classes.chip}
                                />
                            );
                        })
                    }
                </Box>
                {productPriceText}
            </div>
        );
    }
    return <div/>;
};

export default ProductList;
