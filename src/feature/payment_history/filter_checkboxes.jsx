import React from 'react';
import {Box, makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {updatePaymentFilterValue} from "../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


const FilterCheckboxes = () => {
    const classes = useStyles();
    const filterValue = useSelector(state => state.payment.payments.filter);
    const dispatch = useDispatch();
    function handleChange(event) {
        dispatch(updatePaymentFilterValue(event.target.value));
    }

    return (
        <Box>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="filter-simple">Filtrer på status</InputLabel>
                <Select
                    value={filterValue}
                    onChange={handleChange}
                    inputProps={{
                        name: 'Filter',
                        id: 'filter-simple',
                    }}
                >
                    <MenuItem value={1}>Alle</MenuItem>
                    <MenuItem value={2}>Ubetalt</MenuItem>
                    <MenuItem value={3}>Ikke sendt</MenuItem>
                    <MenuItem value={4}>Error</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default FilterCheckboxes;