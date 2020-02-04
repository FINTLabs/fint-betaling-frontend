import React from 'react';
import {Box, makeStyles, Table, Typography,} from '@material-ui/core';
import {useSelector} from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '80%',
        flexDirection: 'column',
        textAlign: "center",
        margin: theme.spacing(1),
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    tableWrapper: {
        maxHeight: 200,
        overflow: 'auto',
    },
    table: {
        overflow: "auto",
    },
    tableBody: {},
    recipientHeader: {
        textAlign:"left",
        color: theme.palette.secondary.main,
        width: '200px',
    },
}));

const ConfirmedRecipients = () => {
    const classes = useStyles();
    const recipients = useSelector((state) => state.payment.payment.recipients);
    return (
        <Box className={classes.root}>
            <Typography variant="h5" className={classes.recipientHeader}>
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
                    <TableBody className={classes.tableBody}>
                        {
                            Object.keys(recipients)
                                .filter(key => recipients[key].checked).map(key => {
                                        return (
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
                                                    {`${recipients[key].addressLine} ${recipients[key].addressZip} ${recipients[key].addressPlace}`}
                                                </TableCell>
                                            </TableRow>
                                        );
                                })
                        }
                    </TableBody>
                </Table>
            </div>
        </Box>
    );
};

export default ConfirmedRecipients;
