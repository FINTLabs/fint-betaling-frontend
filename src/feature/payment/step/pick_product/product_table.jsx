import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Checkbox from '@material-ui/core/Checkbox';
import {makeStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import TablePagination from '@material-ui/core/TablePagination';
import {updateProductAmount, updateProducts, updateSearchPage} from '../../../../data/redux/actions/payment';
import {SEARCH_PAGE_ROWS} from '../../constants';
import Amount from "../../utils/amount";


const useStyles = makeStyles((theme) => ({
    table: {
        overflow: 'auto',
        width: "100%",
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    fab: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    amount: {
        minWidth: "60px",
    },
}));

const ProductTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    let suggestions = useSelector((state) => state.payment.product.filteredSuggestions);
    const query = useSelector((state) => state.payment.product.searchValue);
    const pickedProducts = useSelector((state) => state.payment.payment.products);
    const activePage = useSelector((state) => state.payment.form.page);
    const productsLengthTemp = useSelector((state) => state.payment.product.productsLength);
    const productsLength = query.length === 0 ? 0 : productsLengthTemp;
    const productAmount = useSelector((state) => state.payment.product.amount);
    suggestions = query.length === 0 ? [] : suggestions;
    const rowsPerPage = SEARCH_PAGE_ROWS;

    const tablePagination = productsLength > 10
        ? (
            <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                colSpan={6}
                count={productsLength}
                rowsPerPage={rowsPerPage}
                page={activePage}
                SelectProps={{
                    inputProps: {'aria-label': 'rows per page'},
                    native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
        ) : null;


    function handleIndividualCheck(event, itemCode, description, itemPrice, taxRate, uri) {
        const newArray = {...pickedProducts};
        newArray[itemCode] = {
            checked: event.target.checked,
            description,
            itemPrice,
            taxRate,
            uri,
        };
        if (!productAmount[itemCode]) {
            event.target.value = 1;
            handleAmountChange(event, itemCode);
        }
        dispatch(updateProducts(newArray));
    }

    function handleAmountChange(event, itemCode) {
        const newArray = {...productAmount};
        newArray[itemCode] = {amount: event.target.value};
        dispatch(updateProductAmount(newArray));
    }

    function handleChangePage(event, newPage) {
        dispatch(updateSearchPage(newPage));
    }

    function handleChangeRowsPerPage() {
    }

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell align="left">Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Kode</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Enhet pris, eks. mva.</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Antall</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Pris, eks. mva.</TableCell>
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
                                            <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
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
                                        {suggestion.itemPrice
                                            ? Amount.currency(suggestion.itemPrice)
                                            : ''}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <TextField
                                            id="filled-number"
                                            label="Antall"
                                            value={productAmount[suggestion.itemCode] ? productAmount[suggestion.itemCode].amount ? productAmount[suggestion.itemCode].amount : 1 : 1}
                                            onChange={(e) => handleAmountChange(e, suggestion.itemCode)}
                                            type="number"
                                            className={classes.amount}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                inputProps: {
                                                    min: 1,
                                                    max: 10,
                                                },
                                            }}
                                            margin="normal"
                                            variant="filled"
                                        />
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.itemPrice
                                            ? (
                                                Amount.currency((suggestion.itemPrice)
                                                * (productAmount[suggestion.itemCode] ? productAmount[suggestion.itemCode].amount ? productAmount[suggestion.itemCode].amount : 1 : 1)
                                            ))
                                            : ''}
                                    </TableCell>
                                    <TableCell align="center" className={classes.tableCell}>
                                        <Checkbox
                                            checked={pickedProducts[suggestion.itemCode] ? pickedProducts[suggestion.itemCode].checked : false}
                                            onChange={(e) => handleIndividualCheck(e, suggestion.itemCode, suggestion.description, suggestion.itemPrice, suggestion.taxrate, suggestion.uri)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        },
                    )
                }
                <TableRow>
                    {tablePagination}
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default ProductTable;
