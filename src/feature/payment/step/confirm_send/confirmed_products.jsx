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
    let counter = 1;
    return (
        <Box className={classes.root}>
            <Typography variant="h6" className={classes.recipientHeader}>
                Produkter
            </Typography>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nr.</TableCell>
                            <TableCell align="right">Produkt</TableCell>
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
                                            <TableCell>
                                                {counter++}
                                                .
                                            </TableCell>
                                            <TableCell align="left">{products[key].name}</TableCell>
                                            <TableCell align="right" component="th" scope="row">
                                                {key}
                                            </TableCell>
                                            <TableCell align="right">{productAmounts[key].amount}</TableCell>
                                            <TableCell
                                                align="right"
                                            >
                                                {(parseInt(products[key].price) / 100).toFixed(2)}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                            >
                                                {(parseInt(productAmounts[key].amount) * (parseInt(products[key].price) / 100)).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )
                        }
                        <TableRow>
                            <TableCell align="right" colSpan={5}>
                                <Typography variant="h6">
                                    Total pris per elev eks. mva:
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {getTotalPrice(products, productAmounts)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right" colSpan={5}>
                                <Typography variant="h6">
                                    Inkl. mva:
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {(getTotalPrice(products, productAmounts) * 1.25).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Box>
    );
};

export default ConfirmedProducts;
