import React from 'react';
import { Box, Table, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';
import { getTotalPrice } from '../../utils/list-utils';
import Amount from '../../utils/amount';

const useStyles = makeStyles((theme) => ({
    recipientHeader: {
        textAlign: 'left',
        color: theme.palette.secondary.main,
    },
}));

const ConfirmedProducts = () => {
    const classes = useStyles();
    const products = useSelector((state) => state.payment.payment.products);
    const productAmounts = useSelector((state) => state.payment.product.amount);
    const productPrice = useSelector((state) => state.payment.product.itemPrice);
    const productDescription = useSelector((state) => state.payment.product.description);

    const getProductDescription = (k) => {
        if (productDescription) {
            if (productDescription[k]) {
                return productDescription[k].description;
            }
        }
        return '';
    };

    return (
        <Box p={2} width={1}>
            <Typography variant="h6" className={classes.recipientHeader}>
                Produkter
            </Typography>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Produkt</TableCell>
                        <TableCell>Fritekst</TableCell>
                        <TableCell align="right">Kode</TableCell>
                        <TableCell align="right">Antall</TableCell>
                        <TableCell align="right">Nettopris</TableCell>
                        <TableCell align="right">Nettototal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        Object.keys(products)
                            .filter((key) => products[key].checked)
                            .map((key) => (
                                <TableRow key={key}>
                                    <TableCell align="left">{products[key].description}</TableCell>
                                    <TableCell
                                        align="left"
                                    >
                                        {getProductDescription(key)}
                                    </TableCell>
                                    <TableCell align="right" component="th" scope="row">
                                        {key}
                                    </TableCell>
                                    <TableCell align="right">{productAmounts[key].amount}</TableCell>
                                    <TableCell align="right">
                                        <Amount>{productPrice[key].itemPrice}</Amount>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Amount>
                                            {parseInt(productAmounts[key].amount, 10)
                                            * parseInt(productPrice[key].itemPrice, 10)}
                                        </Amount>
                                    </TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
            <Box p={2} display="flex" flexDirection="column" alignItems="flex-end">
                <Typography variant="body2">
                    Alle beløper er uten mva.
                </Typography>
                <Typography variant="subtitle2">
                    Total beløp per elev:
                </Typography>
                <Typography variant="subtitle1">
                    {getTotalPrice(products, productPrice, productAmounts)}
                </Typography>
            </Box>
            <Divider />
        </Box>
    );
};

export default ConfirmedProducts;
