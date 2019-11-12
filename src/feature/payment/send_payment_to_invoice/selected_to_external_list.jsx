import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, makeStyles, Typography} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import {updateRecipientListOpen, updateSelectedOrders} from '../../../data/redux/actions/payment';
import {countChecked} from '../utils/list_utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
        flexDirection: 'column',
        alignContent: 'center',
        textAlign: 'center',
    },
    chipBox: {
        flexDirection: 'row',
        textAlign: 'start',
        width: '70%',
    },
    chip: {
        flexDirection: 'row',
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    collapseButton: {
        color: theme.palette.secondary.main,
        display: 'flex',
        margin: 'auto',
        marginTop: theme.spacing(1),
    },
}));

const SelectedToExternalList = () => {
    const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
    const classes = useStyles();
    const openCollapse = useSelector((state) => state.payment.recipientList.open);
    const dispatch = useDispatch();
    const selectedOrdersCounted = countChecked(selectedOrders);
    const recipientHeaderText = selectedOrdersCounted > 0
        ? <Typography variant="h6">Mine ordre:</Typography> : '';
    const recipientCountText = selectedOrdersCounted > 0
        ? (
            <Typography>
                Antall:
                {selectedOrdersCounted}
            </Typography>
        ) : '';
    const selectedOrderListKeys = Object.keys(selectedOrders);
    const count = countChecked(selectedOrders);
    let countChipsFirst = 0;
    let countChipsSecond = 0;

    function updateRecipientExtrasOpen() {
        dispatch(updateRecipientListOpen(!openCollapse));
    }

    const chips = count <= 10
        ? selectedOrderListKeys.filter(key => selectedOrders[key].checked).map(key => {
            return (
                <Chip
                    size="small"
                    key={key}
                    value={key}
                    onDelete={() => handleDelete(key)}
                    label={key}
                    className={classes.chip}
                />
            );
        }) : (
            <div>
                {selectedOrderListKeys
                    .filter(key => selectedOrders[key].checked).map(key => {
                        countChipsFirst += 1;
                        if (countChipsFirst <= 10) {
                            return (
                                <Chip
                                    size="small"
                                    key={key}
                                    value={key}
                                    onDelete={() => handleDelete(key)}
                                    label={key}
                                    className={classes.chip}
                                />
                            );
                        } else return null;
                    })}
                {!openCollapse
                    ? <Button className={classes.collapseButton} onClick={updateRecipientExtrasOpen}>Vis flere</Button>
                    : <div/>}
                {openCollapse ? selectedOrderListKeys
                    .filter(key => selectedOrders[key].checked).map(key => {
                        countChipsSecond += 1;
                        if (countChipsSecond > 10) {
                            return (
                                <Chip
                                    size="small"
                                    key={key}
                                    value={key}
                                    onDelete={() => handleDelete(key)}
                                    label={key}
                                    className={classes.chip}
                                />
                            );
                        } else return null;
                    }) : <div/>}
                {openCollapse
                    ? <Button className={classes.collapseButton} onClick={updateRecipientExtrasOpen}>Vis færre</Button>
                    : <div/>}
            </div>
        );


    function handleDelete(key) {
        const newArray = {...selectedOrders};
        newArray[key] = {checked: false};
        dispatch(updateSelectedOrders(newArray));
    }

    if (selectedOrders && Object.keys(selectedOrders).length > 0) {
        return (
            <div className={classes.root}>
                {recipientHeaderText}
                <Box className={classes.chipBox}>
                    {
                        chips
                    }
                </Box>
                {recipientCountText}
            </div>
        );
    }
    return <div/>;
};

export default SelectedToExternalList;
