import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {updateOrdersOpen, updateSelectedOrders} from '../../../data/redux/actions/payment';
import SendToInvoiceTableRow from './send-to-invoice-table-row';
import ClaimRepository from "../../../data/repository/ClaimRepository";
import fetchPayments from "../../../data/redux/actions/payments";

const useStyles = makeStyles(() => ({
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
}));

const SendToInvoiceTable = ({filteredSuggestions, selectedOrders}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const showAll = useSelector((state) => state.payment.sendToExternalSystem.ordersOpen);
    const [toDelete, setToDelete] = useState({});
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);

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

    function handleDeleteCheck(event) {
        const list = {...toDelete};
        list[event.target.value] = {
            checked: event.target.checked,
        };
        setDeleteButtonDisabled(checkDeleteDisabledButtton(event));
        setToDelete(list);
    }

    function checkDeleteDisabledButtton(event) {
        let disabled = true;
        let keys = Object.keys(toDelete);
        if (event.target.checked === true) {
            disabled = false;
        } else {

            keys.forEach(key => {
                if (toDelete[key].checked && (key !== event.target.value)) {
                    disabled = false;
                }
            });
        }
        return disabled;
    }

    function handleDeleteOrders() {
        const keys = Object.keys(toDelete);
        ClaimRepository.cancelPayments(keys.filter(key => {
            return toDelete[key].checked
        })).then(r => {
            console.log(r[0]);
            if (r[0].status === 200) {
                dispatch(fetchPayments());
            }
        })
    }

    return (
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
                                <TableCell align="right" colSpan="4"/>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right" className={classes.tableCell}/>
                                <TableCell>Ordrenummer</TableCell>
                                <TableCell align="left" className={classes.tableCell}>Mottakernavn</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
                                <TableCell align="right" className={classes.tableCell}>Slette</TableCell>
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
                                toDelete={toDelete}
                                handleDeleteCheck={handleDeleteCheck}
                            />
                        ))
                }
                <TableRow>
                    {filteredSuggestions.length > 10 ? (
                        <TableCell colSpan={4}>
                            <Button fullWidth onClick={onShowAll}>
                                {!showAll ? 'Vis alle' : 'Vis kun 10 første'}
                            </Button>
                        </TableCell>
                    ) : <TableCell colSpan={4}/>}
                    <TableCell align={"right"}>
                        <Button
                            disabled={deleteButtonDisabled}
                            onClick={handleDeleteOrders}
                            variant="contained"
                            color="secondary"
                        >
                            Slett valgte
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};


SendToInvoiceTable.propTypes = {
    filteredSuggestions: PropTypes.array.isRequired,
    selectedOrders: PropTypes.any.isRequired,
};

export default SendToInvoiceTable;
