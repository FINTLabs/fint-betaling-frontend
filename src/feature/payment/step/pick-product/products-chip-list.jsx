import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import makeStyles from '@mui/styles/makeStyles';
import { updateProducts } from '../../../../data/redux/actions/payment';
import ChipsListContainer from '../../../../common/chips-list-container';

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

    return (
        <ChipsListContainer
            show={productList && Object.keys(productList).length > 0}
            showAllItems
            onClear={() => dispatch(updateProducts([]))}
            count={productListKeys.filter((key) => productList[key].checked).length}
            title="Valgte produkter"
        >
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
        </ChipsListContainer>
    );
};

export default ProductChipList;
