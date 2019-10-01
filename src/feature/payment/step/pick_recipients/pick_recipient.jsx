import React from 'react';
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {useDispatch, useSelector} from "react-redux";
import RecipientSearch from "./recipient_search";
import {updateSearchBy, updateSearchValue} from "../../../../data/redux/actions/payment";
import {GROUP} from "../../constants";
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

    function handleSearchBy(event) {
        dispatch(updateSearchBy(event.target.value));
        dispatch(updateSearchValue(""));
    }

    return (
        <Box classes={classes.root}>
            <RecipientList/>
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup aria-label="recipientType" name="recipientType" value={recipientType}
                                onChange={handleSearchBy}>
                        <FormControlLabel value="group" control={<Radio/>} label="Gruppe"/>
                        <FormControlLabel value="individual" control={<Radio/>} label="Person"/>
                    </RadioGroup>
                    <RecipientSearch recipientType={recipientType}/>
                </FormControl>
            </form>
        </Box>
    );
};

export default PickPaymentRecipient;