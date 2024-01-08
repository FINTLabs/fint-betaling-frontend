import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Check, Warning } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Link } from 'react-router-dom';
import Amount from '../utils/amount';
import {
    initializePayment,
    updateOrderStatusContent,
    updateOrderStatusOpen,
} from '../../../data/redux/actions/payment';
import { INITIALIZE_PAYMENT } from '../../../data/redux/actions/actions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        alignSelf: 'center',
        margin: 'auto',
    },
    table: {
        overflow: 'auto',
        minWidth: '100%',
        maxWidth: '100%',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
        paddingTop: 0,
        paddingBottom: 0,
    },
    confirmButton: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: 'auto',
        marginTop: theme.spacing(1),
    },
    buttonContainer: {
        marginTop: theme.spacing(2),
    },
    buttonToNewOrder: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: theme.spacing(1),
        float: 'left',
    },
    buttonSendMore: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: theme.spacing(1),
        float: 'right',
    },
    checkIcon: {
        color: theme.palette.secondary.main,
    },
    warningIcon: {
        color: theme.status.danger,
    },
}));

const SentToExternalContainer = () => {
    const data = useSelector((state) => state.payment.backEndResponse.responseOrder);
    const statusOpen = useSelector((state) => state.payment.payment.statusOpen);
    const statusContent = useSelector((state) => state.payment.payment.statusContent);
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleStatusClick = (event, errormessage) => {
        dispatch(updateOrderStatusContent(errormessage));
        dispatch(updateOrderStatusOpen(true));
    };

    const handleClose = () => {
        dispatch(updateOrderStatusOpen(false));
        dispatch(updateOrderStatusContent(''));
    };

    return (
        <Box className={classes.root}>
            <Typography variant="h4">Ordre sendt til fakturering</Typography>
            <Typography variant="body1">Følgende ordre er sendt til fakturering</Typography>

            {data
                ? (
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ordrenummer</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Restbeløp eks. mva.</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map(
                                    (suggestion) => {
                                        const orderStatus = (
                                            <TableCell align="right" className={classes.tableCell}>
                                                {suggestion.claimStatus === 'SEND_ERROR'
                                                || suggestion.claimStatus === 'UPDATE_ERROR'
                                                    ? (
                                                        <Warning
                                                            value={suggestion.error}
                                                            className={classes.warningIcon}
                                                            onClick={(e) => handleStatusClick(
                                                                e,
                                                                suggestion.statusMessage,
                                                            )}
                                                        />
                                                    )
                                                    : (
                                                        <Check
                                                            value={suggestion.error}
                                                            className={classes.checkIcon}
                                                            onClick={handleStatusClick}
                                                        />
                                                    )}
                                            </TableCell>
                                        );
                                        return (
                                            <TableRow hover key={suggestion.orderNumber}>
                                                <TableCell align="left" className={classes.tableCell}>
                                                    {suggestion.orderNumber}
                                                </TableCell>
                                                <TableCell align="right" className={classes.tableCell}>
                                                    {suggestion.customerName}
                                                </TableCell>
                                                <TableCell align="right" className={classes.tableCell}>
                                                    <Amount>{suggestion.originalAmountDue}</Amount>
                                                </TableCell>
                                                {orderStatus}
                                            </TableRow>
                                        );
                                    },
                                )
                            }
                        </TableBody>
                    </Table>
                )
                : <div />}
            {data
                ? (
                    <Paper className={classes.buttonContainer}>
                        <Link
                            to="/opprett-ordre"
                            onClick={() => {
                                dispatch(initializePayment(INITIALIZE_PAYMENT));
                            }}
                            className={classes.cardLink}
                        >
                            <Button className={classes.buttonToNewOrder}>Opprett nye ordre</Button>
                        </Link>
                        <Link
                            to="/ordrehistorikk"
                            onClick={() => {
                                dispatch(initializePayment(INITIALIZE_PAYMENT));
                            }}
                            className={classes.cardLink}
                        >
                            <Button className={classes.buttonSendMore}>Følg med i ordrehistorikken</Button>
                        </Link>
                    </Paper>
                )
                : <div />}
            <Dialog
                open={statusOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Status: </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {statusContent || ''}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Tilbake
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SentToExternalContainer;
