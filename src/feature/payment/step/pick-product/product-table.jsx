import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import {
    updateProductAmount,
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
        width: '100%',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellAmount: {
        width: 30,
    },
}));

const ProductTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useSelector((state) => state.payment.product.searchValue);
    const pickedProducts = useSelector((state) => state.payment.payment.products);
    const activePage = useSelector((state) => state.payment.form.page);
    const productsLengthTemp = useSelector((state) => state.payment.product.productsLength);
    const productsLength = query.length === 0 ? 0 : productsLengthTemp;
    const productAmount = useSelector((state) => state.payment.product.amount);
    const productPrice = useSelector((state) => state.payment.product.itemPrice);

    let suggestions = useSelector((state) => state.payment.product.filteredSuggestions);
    suggestions = query.length === 0 ? [] : suggestions;

    const handleAmountChange = (newAmount, itemCode) => {
        const newArray = { ...productAmount };
        newArray[itemCode] = { amount: newAmount };
        dispatch(updateProductAmount(newArray));
    };

    const handleItemPriceChange = (newItemPrice, itemCode) => {
        const item = { ...productPrice };
        item[itemCode] = { itemPrice: newItemPrice };
        dispatch(updateProductPrice(item));
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
        }
        dispatch(updateProducts(newArray));
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
        <Box>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Navn</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Kode</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Netto pris pr. enhet</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Antall</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Netto sum</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Velg</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        suggestions.map(
                            (suggestion) => {
                                const product = suggestion.description;
                                const matches = match(product, query);
                                const parts = parse(product, matches);

                                return (
                                    <TableRow hover key={suggestion.itemCode}>
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
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.itemCode
                                                ? suggestion.itemCode
                                                : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <PriceField
                                                disabled={!pickedProducts[suggestion.itemCode]}
                                                value={getPrice(suggestion).toString()}
                                                itemCode={suggestion.itemCode}
                                                onChange={handleItemPriceChange}
                                            />
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCellAmount}>
                                            <FormControl>
                                                <Input
                                                    disabled={!pickedProducts[suggestion.itemCode]}
                                                    label="Antall"
                                                    value={getAmount(suggestion)}
                                                    onChange={(e) => handleAmountChange(
                                                        e.target.value, suggestion.itemCode,
                                                    )}
                                                    type="number"
                                                    margin="dense"
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <Amount>{getPrice(suggestion) * getAmount(suggestion)}</Amount>
                                        </TableCell>
                                        <TableCell align="center" className={classes.tableCell}>
                                            <Checkbox
                                                checked={pickedProducts[suggestion.itemCode]
                                                    ? pickedProducts[suggestion.itemCode].checked
                                                    : false}
                                                onChange={(e) => handleIndividualCheck(e,
                                                    suggestion.itemCode,
                                                    suggestion.description,
                                                    suggestion.itemPrice,
                                                    suggestion.taxrate,
                                                    suggestion.uri)}
                                            />
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
