import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {SEARCH_PAGE_ROWS} from "../constants";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    table: {
        overflow: 'auto',
        minWidth: "100%",
        maxWidth: "100%",
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

const SendToInvoiceContainer = () => {

    const payments = useSelector(state => state.payments.payments);
    const notSentPayments = getNotSentPayments();
    const classes = useStyles();
    const dispatch = useDispatch();
    const rowsPerPage = SEARCH_PAGE_ROWS;
    const notSentPaymentsLength = notSentPayments ? notSentPayments.length : 0;
    console.log("notSendPayments: ", notSentPayments);

    function getNotSentPayments() {
        console.log(payments);
        let array = [];
        if (payments) {
            for (let index = 0; index < payments.length; index++) {
                if (!payments[index].sentTilEksterntSystem) {
                    array.push(payments[index]);
                }
            }
        }
        return array;
    }

    function handleIndividualCheck() {

    }

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>E-postadresse</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Telefonnummer</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Velg som mottaker</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>

            </TableBody>
        </Table>
    );
};

export default SendToInvoiceContainer;