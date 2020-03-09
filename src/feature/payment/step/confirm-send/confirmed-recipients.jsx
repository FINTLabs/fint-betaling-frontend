import React from 'react';
import {
    Box, makeStyles, Table, Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        maxHeight: 200,
        overflow: 'auto',
    },
    table: {
        overflow: 'auto',
    },
    recipientHeader: {
        textAlign: 'left',
        color: theme.palette.secondary.main,
    },
}));

const ConfirmedRecipients = () => {
    const classes = useStyles();
    const recipients = useSelector((state) => state.payment.payment.recipients);

    return (
        <Box p={2}>
            <Typography variant="h6" className={classes.recipientHeader}>
                Mottakere
            </Typography>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Kundenummer</TableCell>
                            <TableCell align="right">Navn</TableCell>
                            <TableCell align="right">E-postadresse</TableCell>
                            <TableCell align="right">Telefonnummer</TableCell>
                            <TableCell align="right">Postadresse</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.keys(recipients)
                                .filter((key) => recipients[key].checked)
                                .map((key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {key}
                                        </TableCell>
                                        <TableCell align="right">{recipients[key].name}</TableCell>
                                        <TableCell align="right">{recipients[key].email}</TableCell>
                                        <TableCell align="right">{recipients[key].cellPhoneNumber}</TableCell>
                                        <TableCell
                                            align="right"
                                        >
                                            {`${recipients[key].addressLine} 
                                            ${recipients[key].addressZip} 
                                            ${recipients[key].addressPlace}`}
                                        </TableCell>
                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </div>
        </Box>
    );
};

export default ConfirmedRecipients;
