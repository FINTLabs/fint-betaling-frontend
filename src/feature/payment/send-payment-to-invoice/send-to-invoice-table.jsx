import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import {Dialog, makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {updateOrdersOpen, updateSelectedOrders} from '../../../data/redux/actions/payment';
import SendToInvoiceTableRow from './send-to-invoice-table-row';
import ClaimRepository from "../../../data/repository/ClaimRepository";
import fetchPayments from "../../../data/redux/actions/payments";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
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
    deleteButton: {
        backgroundColor: theme.status.error,
        color: theme.palette.primary.main
    },
}));

const SendToInvoiceTable = ({filteredSuggestions, selectedOrders}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const showAll = useSelector((state) => state.payment.sendToExternalSystem.ordersOpen);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    function handleIndividualCheck(event) {
        const list = {...selectedOrders};
        list[event.target.value] = {
            checked: event.target.checked,
        };
        dispatch(updateSelectedOrders(list));
    }

    function displayedOrderIsInSelectedOrders(orderNumber) {
        return Object.keys(selectedOrders)
            .filter((key) => key === orderNumber).length > 0;
    }

    function isAllChecked() {
        let allChecked = true;

        filteredSuggestions.forEach((v, i) => {
            if (!(!showAll && i >= 10)) {
                if (!displayedOrderIsInSelectedOrders(v.orderNumber) || !selectedOrders[v.orderNumber].checked) {
                    allChecked = false;
                }
            }
        });

        return allChecked;
    }

    function handleAllChecked(event) {
        const list = {...selectedOrders};
        for (let i = 0; i < filteredSuggestions.length; i += 1) {
            if (!(!showAll && i >= 10)) {
                list[filteredSuggestions[i].orderNumber] = {
                    checked: event.target.checked,
                };
            }
        }
        dispatch(updateSelectedOrders(list));
    }

    function onShowAll() {
        dispatch(updateOrdersOpen(!showAll));
    }

    function handleDeleteOrders() {
        const keys = Object.keys(selectedOrders).filter((key) => selectedOrders[key].checked);
        ClaimRepository.cancelPayments(keys).then(r => {
            console.log(r);
            dispatch(fetchPayments());
            dispatch(updateSelectedOrders([]));
            setDeleteDialogOpen(false);
        });
    }

    function handleCloseDialog() {
        setDeleteDialogOpen(false);
    }

    function handleDeleteOrdersDialogOpen() {
        setDeleteDialogOpen(true);
    }

    return (
        <>
            <Table className={classes.table} size="small">
                <TableHead>
                    {filteredSuggestions.length > 0
                        ? (
                            <>
                                <TableRow>
                                    <TableCell align="left" className={classes.tableCell}>
                                        <Checkbox
                                            checked={isAllChecked()}
                                            onChange={handleAllChecked}
                                        />
                                        Velg alle
                                    </TableCell>
                                    <TableCell align="right" colSpan="3"/>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right" className={classes.tableCell}/>
                                    <TableCell>Ordrenummer</TableCell>
                                    <TableCell align="left" className={classes.tableCell}>Mottakernavn</TableCell>
                                    <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
                                </TableRow>
                            </>
                        )
                        : <TableRow/>}

                </TableHead>
                <TableBody>
                    {
                        filteredSuggestions
                            .slice(0, showAll ? filteredSuggestions.length : 10)
                            .map((suggestion) => (
                                <SendToInvoiceTableRow
                                    key={suggestion.orderNumber}
                                    handleIndividualCheck={handleIndividualCheck}
                                    selectedOrders={selectedOrders}
                                    suggestion={suggestion}
                                />
                            ))
                    }
                    <TableRow>
                        {filteredSuggestions.length > 10 ? (
                            <TableCell colSpan={3}>
                                <Button fullWidth onClick={onShowAll}>
                                    {!showAll ? 'Vis alle' : 'Vis kun 10 første'}
                                </Button>
                            </TableCell>
                        ) : <TableCell colSpan={3}/>}
                        <TableCell align={"right"}>
                            <Button
                                disabled={Object.keys(selectedOrders)
                                    .filter((key) => selectedOrders[key].checked).length < 1}
                                onClick={handleDeleteOrdersDialogOpen}
                                variant="contained"
                                className={classes.deleteButton}
                                size={"small"}
                            >
                                Slett valgte
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Slette ordre?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Er du sikker på at du ønsker å slette ordrene du har valgt?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary" variant={"contained"}>
                        Nei
                    </Button>
                    <Button onClick={handleDeleteOrders} color="secondary" autoFocus variant={"contained"}>
                        Ja
                    </Button>
                </DialogActions>
            </Dialog></>
    );
};


SendToInvoiceTable.propTypes = {
    filteredSuggestions: PropTypes.array.isRequired,
    selectedOrders: PropTypes.any.isRequired,
};

export default SendToInvoiceTable;
