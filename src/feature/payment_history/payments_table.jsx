import React from 'react';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Table from "@material-ui/core/Table";
import {makeStyles} from "@material-ui/core";
import {useSelector} from "react-redux";
import {ORDER_NUMBER} from "../payment/constants";

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
    },

}));

const PaymentsTable = () => {
    const query = useSelector(state => state.payment.payments.searchValue);
    let suggestions = useSelector(state => state.payment.payments.filteredSuggestions);
    const payments = useSelector(state => state.payments.payments);
    const searchBy = useSelector(state => state.payment.payments.searchBy).toString();
    suggestions = query.length === 0 ? [] : suggestions;
    const classes = useStyles();

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Ordrenummer</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Totalpris</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Å betale</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    suggestions.map(
                        suggestion => {
                            const payment = searchBy === ORDER_NUMBER ? suggestion.ordrenummer.toString() : suggestion.kunde.fulltNavn;
                            const matches = match(payment, query);
                            const parts = parse(payment, matches);

                            const orderNumberAndName = searchBy === ORDER_NUMBER ?
                                (<div>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {parts.map(part => (
                                            <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                                            {part.text}
                                        </span>
                                        ))}
                                    </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.kunde ? suggestion.kunde.fulltNavn : ''}
                                        </TableCell>
                                </div>
                                )
                                :
                                (
                                    <div>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.kunde ? suggestion.kunde.fulltNavn : ''}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {parts.map(part => (
                                                <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                                            {part.text}
                                        </span>
                                            ))}
                                        </TableCell>
                                    </div>
                                );


                            return (
                                <TableRow hover>
                                    <TableCell align="left" className={classes.tableCell}>
                                        'status'
                                    </TableCell>
                                    {orderNumberAndName}
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.kontaktinformasjon ?
                                            suggestion.kontaktinformasjon.epostadresse ?
                                                suggestion.kontaktinformasjon.epostadresse
                                                : "" : ""}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.kontaktinformasjon ?
                                            suggestion.kontaktinformasjon.mobiltelefonnummer ?
                                                suggestion.kontaktinformasjon.mobiltelefonnummer
                                                : "" : ""}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.kontaktinformasjon ?
                                            suggestion.kontaktinformasjon.mobiltelefonnummer ?
                                                suggestion.kontaktinformasjon.mobiltelefonnummer
                                                : "" : ""}
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

export default PaymentsTable;