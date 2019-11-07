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
import TextField from '@material-ui/core/TextField';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import TablePagination from '@material-ui/core/TablePagination';
import { updateProductAmount, updateProducts, updateSearchPage } from '../../../../data/redux/actions/payment';
import { SEARCH_PAGE_ROWS } from '../../constants';


const useStyles = makeStyles((theme) => ({
  table: {
    overflow: 'auto',
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
        rowsPerPageOptions={rowsPerPage}
        colSpan={6}
        count={productsLength}
        rowsPerPage={rowsPerPage}
        page={activePage}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    ) : <div />;

  function handleIndividualCheck(event, code, name, price, uri) {
    const newArray = { ...pickedProducts };
    console.log("URI: ", uri);
    newArray[code] = {
      checked: event.target.checked,
      name,
      price,
      uri,
    };
    if (!productAmount[code]) {
      event.target.value = 1;
      handleAmountChange(event, code);
    }
    dispatch(updateProducts(newArray));
  }

  function handleAmountChange(event, code) {
    const newArray = { ...productAmount };
    newArray[code] = { amount: event.target.value };
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
          <TableCell align="right" className={classes.tableCell}>Enhet pris</TableCell>
          <TableCell align="right" className={classes.tableCell}>Antall</TableCell>
          <TableCell align="right" className={classes.tableCell}>Pris</TableCell>
          <TableCell align="right" className={classes.tableCell}>Velg</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          suggestions.map(
            (suggestion) => {
              const product = suggestion.navn;
              const matches = match(product, query);
              const parts = parse(product, matches);

              return (
                <TableRow hover>
                  <TableCell align="left" className={classes.tableCell}>
                    {parts.map((part) => (
                      <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                        {part.text}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell align="right" className={classes.tableCell}>
                    {suggestion.kode
                      ? suggestion.kode
                      : ''}
                  </TableCell>
                  <TableCell align="right" className={classes.tableCell}>
                    {suggestion.pris
                      ? (suggestion.pris / 100).toFixed(2)
                      : ''}
                  </TableCell>
                  <TableCell align="right" className={classes.tableCell}>
                    <TextField
                      id="filled-number"
                      label="Antall"
                      value={productAmount[suggestion.kode] ? productAmount[suggestion.kode].amount ? productAmount[suggestion.kode].amount : 1 : 1}
                      onChange={(e) => handleAmountChange(e, suggestion.kode)}
                      type="number"
                      className={classes.textField}
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
                    {suggestion.pris
                      ? (
                        (suggestion.pris / 100)
                        * (productAmount[suggestion.kode] ? productAmount[suggestion.kode].amount ? productAmount[suggestion.kode].amount : 1 : 1)
                      ).toFixed(2)
                      : ''}
                  </TableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    <Checkbox
                      checked={pickedProducts[suggestion.kode] ? pickedProducts[suggestion.kode].checked : false}
                      onChange={(e) => handleIndividualCheck(e, suggestion.kode, suggestion.navn, suggestion.pris, suggestion._links.self[0].href)}
                    />
                  </TableCell>
                </TableRow>
              );
            },
          )
        }
        {tablePagination}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
