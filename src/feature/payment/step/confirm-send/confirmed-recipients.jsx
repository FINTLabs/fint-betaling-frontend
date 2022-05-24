import React from 'react';
import { Box, Table, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';

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
    const keys = Object.keys(recipients)
        .filter((key) => recipients[key].checked);

    const sortedRecipients = [];

    keys.map((key) => {
        if (recipients[key].checked) {
            const newEntry = {
                ...recipients[key],
                key,
            };
            sortedRecipients.push(newEntry);
        }
        return key;
    });

    sortedRecipients.sort((a, b) => (a.name > b.name ? 1 : -1));

    return (
        <Box p={2} width="inherit">
            <Typography variant="h6" className={classes.recipientHeader}>
                Mottakere
            </Typography>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Navn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            sortedRecipients
                                .map((entry) => (
                                    <TableRow key={entry.key}>
                                        <TableCell>{entry.name}</TableCell>
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
