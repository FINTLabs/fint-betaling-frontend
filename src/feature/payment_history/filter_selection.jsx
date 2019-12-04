import React from 'react';
import {Box, makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {updatePaymentFilterValue, updatePaymentsSuggestions} from "../../data/redux/actions/payment";
import {FILTER_ALL, FILTER_SEND_ERROR, FILTER_SENT, FILTER_STORED, FILTER_UPDATE_ERROR} from "../payment/constants";
import {filterSuggestions} from "../payment/utils/filter";

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


const FilterSelect = () => {
    const classes = useStyles();
    const filterValue = useSelector(state => state.payment.payments.filter);
    const payments = useSelector((state) => state.payments.payments);
    const searchBy = useSelector((state) => state.payment.payments.searchBy).toString();
    const searchValue = useSelector((state) => state.payment.payments.searchValue);
    const dispatch = useDispatch();

    function handleChange(event) {
        dispatch(updatePaymentFilterValue(event.target.value));
        dispatch(updatePaymentsSuggestions(filterSuggestions(searchValue, payments, searchBy, event.target.value)));
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
                    <MenuItem value={FILTER_ALL}>Alle</MenuItem>
                    <MenuItem value={FILTER_SENT}>Ubetalt</MenuItem>
                    <MenuItem value={FILTER_STORED}>Ikke sendt</MenuItem>
                    <MenuItem value={FILTER_UPDATE_ERROR}>Oppdateringsfeil</MenuItem>
                    <MenuItem value={FILTER_SEND_ERROR}>Feil ved sending</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default FilterSelect;