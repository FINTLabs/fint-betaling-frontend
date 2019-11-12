import React from 'react';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {updateExpirationDate} from '../../../../data/redux/actions/payment';

const useStyles = makeStyles((theme) => ({

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    menuItem: {
        color: 'black',
    },
}));

const ExpirationDatePicker = () => {
    const classes = useStyles();
    const dates = useSelector((state) => state.dates.dates);
    const expirationDate = useSelector((state) => state.payment.payment.expirationDate);
    const dispatch = useDispatch();

    function handleExpirationDateChange(event) {
        dispatch(updateExpirationDate(event.target.value));
    }

    return (

        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Forfallslengde</InputLabel>
            <Select
                value={expirationDate}
                onChange={handleExpirationDateChange}
                inputProps={{
                    name: 'Forfallslengde',
                    id: 'age-simple',
                }}
            >
                {
                    dates.map((date) => (
                        <MenuItem className={classes.menuItem} key={date} value={date}>{date}</MenuItem>
                    ))
                }

            </Select>
        </FormControl>

    );
};

export default ExpirationDatePicker;
