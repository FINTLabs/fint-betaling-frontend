import React from 'react';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {updateRequestedNumberOfDaysToPaymentDeadLine} from '../../../../data/redux/actions/payment';

const useStyles = makeStyles((theme) => ({

    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
}));

const ExpirationDatePicker = () => {
    const classes = useStyles();
    const dates = useSelector((state) => state.dates.dates);
    const requestedNumberOfDaysToPaymentDeadLine = useSelector((state) => state.payment.payment.expirationDate);
    const dispatch = useDispatch();

    function handleRequestedNumberOfDaysToPaymentDeadLineChange(event) {
        dispatch(updateRequestedNumberOfDaysToPaymentDeadLine(event.target.value));
    }

    return (

        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="deadline-select">Forfallslengde</InputLabel>
            <Select
                value={requestedNumberOfDaysToPaymentDeadLine}
                onChange={handleRequestedNumberOfDaysToPaymentDeadLineChange}
                inputProps={{
                    name: 'Forfallslengde',
                    id: 'deadline-select',
                }}
            >
                {
                    dates.map((date) => (
                        <MenuItem key={date} value={date}>{date}</MenuItem>
                    ))
                }

            </Select>
        </FormControl>

    );
};

export default ExpirationDatePicker;
