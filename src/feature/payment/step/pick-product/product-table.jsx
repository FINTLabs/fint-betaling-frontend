import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Checkbox from '@mui/material/Checkbox';
import { TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import {
    updateFailedProductForm,
    updateProductAmount,
    updateProductDescription,
    updateProductPrice,
    updateProducts,
    updateSearchPage,
} from '../../../../data/redux/actions/payment';
import Amount from '../../utils/amount';
import Pagination from '../../../../common/pagination';
import PriceField from '../../../../common/price-field';

const useStyles = makeStyles(() => ({
    table: {
        overflow: 'auto',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellAmount: {
        width: 30,
    },
    tableCellDescription: {
        minWidth: 250,
    },
    tableCellPrice: {
        minWidth: 75,
        maxWidth: 100,
    },
}));

const ProductTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useSelector((state) => state.payment.product.searchValue);
    const pickedProducts = useSelector((state) => state.payment.payment.products);
    const activePage = useSelector((state) => state.payment.form.page);
    // const productsLengthTemp = useSelector((state) => state.payment.product.productsLength);
    // const productsLength = query.length === 0 ? 0 : productsLengthTemp;
    const productsLength = useSelector((state) => state.payment.product.productsLength);
    const productAmount = useSelector((state) => state.payment.product.amount);
    const productPrice = useSelector((state) => state.payment.product.itemPrice);
    const productDescription = useSelector((state) => state.payment.product.description);

    const suggestions = useSelector((state) => state.payment.product.filteredSuggestions);
    // suggestions = query.length === 0 ? [] : suggestions;

    const handleAmountChange = (newAmount, itemCode) => {
        if (newAmount > 0) {
            const newArray = { ...productAmount };
            newArray[itemCode] = { amount: newAmount };
            dispatch(updateProductAmount(newArray));
            dispatch(updateFailedProductForm(false));
        }
    };

    const handleItemPriceChange = (newItemPrice, itemCode) => {
        const item = { ...productPrice };
        item[itemCode] = { itemPrice: newItemPrice };
        dispatch(updateProductPrice(item));
        dispatch(updateFailedProductForm(false));
    };

    const handleItemDescriptionChange = (newDescription, itemCode) => {
        const item = { ...productDescription };
        item[itemCode] = { description: newDescription };
        dispatch(updateProductDescription(item));
    };

    const handleIndividualCheck = (event, itemCode, description, itemPrice, taxRate, uri) => {
        const newArray = { ...pickedProducts };
        newArray[itemCode] = {
            checked: event.target.checked,
            description,
            itemPrice,
            taxRate,
            uri,
        };
        if (!productAmount[itemCode]) {
            handleAmountChange(1, itemCode);
            handleItemPriceChange(itemPrice, itemCode);
        }
        dispatch(updateProducts(newArray));
        dispatch(updateFailedProductForm(false));
    };

    const handleChangePage = (event, newPage) => {
        dispatch(updateSearchPage(newPage));
    };

    const getAmount = (suggestion) => {
        if (productAmount[suggestion.itemCode] && productAmount[suggestion.itemCode].amount) {
            return productAmount[suggestion.itemCode].amount;
        }
        return 1;
    };

    const getPrice = (suggestion) => {
        if (productPrice[suggestion.itemCode] && productPrice[suggestion.itemCode].itemPrice) {
            return productPrice[suggestion.itemCode].itemPrice;
        }
        return suggestion.itemPrice;
    };

    return (
        <Box overflow="auto">
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" className={classes.tableCell}>Velg</TableCell>
                        <TableCell align="left">
                            Navn
                            {suggestions.length}
                        </TableCell>
                        <TableCell align="left">Fritekst</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Kode</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Mva</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Netto pris pr. enhet</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Antall</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Netto sum</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        suggestions.slice(activePage * 10, activePage * 10 + 10).map(
                            (suggestion) => {
                                const product = suggestion.description;
                                const matches = match(product, query);
                                const parts = parse(product, matches);

                                return (
                                    <TableRow hover key={suggestion.itemCode}>
                                        <TableCell align="center" className={classes.tableCell}>
                                            <Checkbox
                                                checked={pickedProducts[suggestion.itemCode]
                                                    ? pickedProducts[suggestion.itemCode].checked
                                                    : false}
                                                onChange={(e) => handleIndividualCheck(
                                                    e,
                                                    suggestion.itemCode,
                                                    suggestion.description,
                                                    suggestion.itemPrice,
                                                    suggestion.taxrate,
                                                    suggestion.uri,
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell align="left" className={classes.tableCell}>
                                            {parts.map((part) => (
                                                <span
                                                    key={part.text}
                                                    style={{ fontWeight: part.highlight ? 500 : 400 }}
                                                >
                                                    {part.text}
                                                </span>
                                            ))}
                                        </TableCell>
                                        <TableCell align="left" className={classes.tableCellDescription}>
                                            <TextField
                                                variant="standard"
                                                fullWidth
                                                disabled={pickedProducts[suggestion.itemCode]
                                                    ? !pickedProducts[suggestion.itemCode].checked : true}
                                                onChange={(
                                                    e,
                                                ) => handleItemDescriptionChange(e.target.value, suggestion.itemCode)}
                                            />
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.itemCode
                                                ? suggestion.itemCode
                                                : '-'}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.taxrate
                                                ? `${(parseInt(suggestion.taxrate, 10) / 10).toString()}%`
                                                : '-'}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCellPrice}>
                                            <PriceField
                                                disabled={pickedProducts[suggestion.itemCode]
                                                    ? !pickedProducts[suggestion.itemCode].checked : true}
                                                value={getPrice(suggestion)
                                                    .toString()}
                                                itemCode={suggestion.itemCode}
                                                onChange={handleItemPriceChange}
                                            />
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCellAmount}>
                                            <FormControl>
                                                <Input
                                                    disabled={pickedProducts[suggestion.itemCode]
                                                        ? !pickedProducts[suggestion.itemCode].checked : true}
                                                    label="Antall"
                                                    value={getAmount(suggestion)}
                                                    onChange={
                                                        (e) => handleAmountChange(e.target.value, suggestion.itemCode)
                                                    }
                                                    type="number"
                                                    margin="dense"
                                                    variant="standard"
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <Amount>{getPrice(suggestion) * getAmount(suggestion)}</Amount>
                                        </TableCell>
                                    </TableRow>
                                );
                            },
                        )
                    }

                </TableBody>
            </Table>
            <Pagination
                activePage={activePage}
                suggestionsLength={productsLength}
                handleChangePage={handleChangePage}
            />
        </Box>
    );
};

export default ProductTable;
