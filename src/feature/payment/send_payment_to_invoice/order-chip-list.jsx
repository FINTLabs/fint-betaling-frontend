import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { updateSelectedOrders, updateShowAllRecipients } from '../../../data/redux/actions/payment';
import { getCheckedCount } from '../utils/list_utils';
import ChipsListContainer from '../../../common/chips-list-container';

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
        margin: theme.spacing(0.5),
    },
}));

const OrderChipList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const selectedOrders = useSelector((state) => state.payment.sendToExternalSystem.selectedOrders);
    const showAll = useSelector((state) => state.payment.recipientList.showAll);
    const selectedOrderListKeys = Object.keys(selectedOrders);


    function toggleShowAll() {
        dispatch(updateShowAllRecipients(!showAll));
    }

    function handleDelete(key) {
        const newArray = { ...selectedOrders };
        newArray[key] = { checked: false };
        dispatch(updateSelectedOrders(newArray));
    }

    return (
        <ChipsListContainer
            show={getCheckedCount(selectedOrders) > 0}
            toggleShowAllItems={toggleShowAll}
            showAllItems={showAll}
            onClear={() => dispatch(updateSelectedOrders([]))}
            count={getCheckedCount(selectedOrders)}
            title="Valgte ordre"
        >
            {
                selectedOrderListKeys.filter((key) => selectedOrders[key].checked)
                    .splice(0, showAll ? selectedOrderListKeys.length : 10)
                    .map((key) => (
                        <Chip
                            size="small"
                            key={key}
                            value={key}
                            onDelete={() => handleDelete(key)}
                            label={key}
                            className={classes.chip}
                            color="secondary"
                        />
                    ))
            }
        </ChipsListContainer>
    );
};

export default OrderChipList;
