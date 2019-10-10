import React from 'react';
import {makeStyles, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
    root: {

    },
    table: {

    },
}));

const PaymentSent = () => {
    const classes = useStyles();
    const expirationDate = useSelector(state => state.payment.payment.expirationDate);
    const dispatch = useDispatch();
    const recipients = useSelector(state => state.payment.payment.recipients);
    const products = useSelector(state => state.payment.payment.products);
    const productsAmount = useSelector(state => state.payment.product.amount);

    return (
        <Box className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            TEST
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            TEST
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );
};

export default PaymentSent;