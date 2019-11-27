import React from 'react';
import {Box, makeStyles, Table, Typography,} from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {useSelector} from 'react-redux';
import {getTotalPrice} from '../../utils/list_utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(1),
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        width: 600,
    },
    tableWrapper: {},
    table: {},
    tableBody: {},
    recipientHeader: {
        justifyContent: 'center',
        color: theme.palette.secondary.main,
        width: '200px',
    },
}));

const ConfirmedProducts = () => {
    const classes = useStyles();
    const products = useSelector((state) => state.payment.payment.products);
    const productAmounts = useSelector((state) => state.payment.product.amount);
    return (
        <Box className={classes.root}>
            <Typography variant="h6" className={classes.recipientHeader}>
                Produkter
            </Typography>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Produkt</TableCell>
                            <TableCell align="right">Kode</TableCell>
                            <TableCell align="right">Antall</TableCell>
                            <TableCell align="right">Nettopris</TableCell>
                            <TableCell align="right">Nettototal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {
                            Object.keys(products)
                                .filter(key => products[key].checked).map(key => {
                                    return (
                                        <TableRow key={key}>
                                            <TableCell align="left">{products[key].description}</TableCell>
                                            <TableCell align="right" component="th" scope="row">
                                                {key}
                                            </TableCell>
                                            <TableCell align="right">{productAmounts[key].amount}</TableCell>
                                            <TableCell
                                                align="right"
                                            >
                                                {(parseInt(products[key].itemPrice) / 100).toFixed(2)}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                            >
                                                {(parseInt(productAmounts[key].amount) * (parseInt(products[key].itemPrice) / 100)).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )
                        }
                        <TableRow>
                            <TableCell align="right" colSpan={6}>
                                <Typography variant="body1">
                                    Alle beløper er uten mva.
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right" colSpan={6}>
                                <Typography variant="h6">
                                    Total beløp per elev:
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {getTotalPrice(products, productAmounts)},-
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Box>
    );
};

export default ConfirmedProducts;
