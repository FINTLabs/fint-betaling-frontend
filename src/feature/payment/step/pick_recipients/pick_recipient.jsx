import React from 'react';
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {useDispatch, useSelector} from "react-redux";
import RecipientSearch from "./recipient_search";
import {updateSearchBy, updateSearchValue, updateSuggestions} from "../../../../data/redux/actions/payment";
import {GROUP, INDIVIDUAL} from "../../constants";
import RecipientList from "./recipient_list";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
    root: {},
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 500,
        margin: "auto",
    },
    formControl: {
        width: "60%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const PickPaymentRecipient = () => {

    const classes = useStyles();
    const recipientType = useSelector(state => state.payment.form.searchBy);
    const dispatch = useDispatch();
    const groups = useSelector(state => state.groups.groups);
    const individual = useSelector(state => state.customers.customers);
    dispatch(updateSuggestions(recipientType.toString() === GROUP ? groups : individual));

    function handleSearchBy(event) {
        dispatch(updateSearchBy(event.target.value));
        dispatch(updateSearchValue(""));
        dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
    }

    return (
        <Box classes={classes.root}>
            <RecipientList/>
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup aria-label="recipientType" name="recipientType" value={recipientType}
                                onChange={handleSearchBy}>
                        <FormControlLabel value={GROUP.toString()} control={<Radio/>} label="Gruppe"/>
                        <FormControlLabel value={INDIVIDUAL.toString()} control={<Radio/>} label="Person"/>
                    </RadioGroup>
                    <RecipientSearch/>
                </FormControl>
            </form>
        </Box>
    );
};

export default PickPaymentRecipient;