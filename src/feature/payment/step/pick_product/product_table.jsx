import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Checkbox from "@material-ui/core/Checkbox";
import {makeStyles} from "@material-ui/core";
import {updateProducts} from "../../../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
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
    }
}));

const ProductTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    let suggestions = useSelector(state => state.payment.product.filteredSuggestions);
    const query = useSelector(state => state.payment.product.searchValue);
    const pickedProducts = useSelector(state => state.payment.payment.products);
    suggestions = query.length === 0 ? [] : suggestions;

    function handleIndividualCheck(event, kode, name, price) {
        console.log(kode);
        const newArray = {...pickedProducts};
        newArray[kode] = {"checked": event.target.checked, "name": name, "price": price};
        dispatch(updateProducts(newArray));
    }

    console.log(pickedProducts);

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Kode</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Pris</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Velg</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
                {
                    suggestions.map(
                        suggestion => {
                            const product = suggestion.navn;
                            const matches = match(product, query);
                            const parts = parse(product, matches);

                            return (
                                <TableRow hover>
                                    <TableCell align="left" className={classes.tableCell}>
                                        {parts.map(part => (
                                            <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                                            {part.text}
                                        </span>
                                        ))}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.kode ?
                                                suggestion.kode
                                                : ""}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.pris ?
                                            (suggestion.pris/100).toFixed(2)
                                                : ""}
                                    </TableCell>
                                    <TableCell align="center" className={classes.tableCell}>
                                        <Checkbox
                                            checked={pickedProducts[suggestion.kode] ? pickedProducts[suggestion.kode].checked : false}
                                            onChange={ (e) => handleIndividualCheck(e, suggestion.kode, suggestion.navn, suggestion.pris)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )
                }
            </TableBody>
        </Table>
    );
};

export default ProductTable;