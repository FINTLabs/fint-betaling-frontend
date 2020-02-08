import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { updateProducts } from '../../../../data/redux/actions/payment';
import { getCheckedCount, getTotalPrice } from '../../utils/list_utils';

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));

const ProductChipList = () => {
    const classes = useStyles();
    const productList = useSelector((state) => state.payment.payment.products);
    const productAmount = useSelector((state) => state.payment.product.amount);
    const dispatch = useDispatch();
    const productListKeys = Object.keys(productList);

    function handleDelete(key) {
        const newArray = { ...productList };
        newArray[key] = { checked: false };
        dispatch(updateProducts(newArray));
    }

    if (productList && Object.keys(productList).length > 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                p={2}
                flexDirection="column"
                alignItems="center"
                flexWrap="flex"
                mt={2}
                bgcolor="grey.100"
                borderRadius="borderRadius"
            >
                <Typography variant="h6">Valgte produkter</Typography>
                <Box display="flex" justifyContent="center" flexWrap="wrap" m={1}>
                    {
                        productListKeys.filter((key) => productList[key].checked)
                            .map((key) => {
                                const labelText = `${productList[key].description} x${productAmount[key].amount}`;
                                return (
                                    <Chip
                                        size="small"
                                        key={key}
                                        value={key}
                                        onDelete={() => handleDelete(key)}
                                        label={labelText}
                                        className={classes.chip}
                                        color="secondary"
                                    />
                                );
                            })
                    }
                </Box>
                <Typography>
                    Total beløp per mottaker:
                    {getTotalPrice(productList, productAmount)}
                    eks. mva.
                </Typography>
            </Box>
        );
    }
    return <div />;
};

export default ProductChipList;
