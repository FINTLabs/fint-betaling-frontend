import React from 'react';
import {makeStyles} from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
    picker: {
        marginTop: theme.spacing(0),
    },
}));


const FilterDate = (props) => {
    const {selectedDate, handleDateChange, disabled} = props;
    const classes = useStyles();

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                className={classes.picker}
                disabled={disabled}
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Opprettelsesdato"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    );

};

export default FilterDate;
