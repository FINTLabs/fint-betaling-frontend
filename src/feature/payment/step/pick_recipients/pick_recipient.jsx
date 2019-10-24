import React from 'react';
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {useDispatch, useSelector} from "react-redux";
import RecipientSearch from "./recipient_search";
import {
    updateConfirmRecipientsOpen,
    updateSearchBy,
    updateSearchPage,
    updateSearchValue,
    updateSuggestions
} from "../../../../data/redux/actions/payment";
import {GROUP, INDIVIDUAL, SEARCH_PAGE_START} from "../../constants";
import RecipientList from "../recipient_list";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ConfirmRecipients from "./confirm_recipients";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: "center",
    },
    formControl: {
        flex: "1/3",
        margin: theme.spacing(3),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        "&:enabled": {
            backgroundColor: theme.palette.secondary.main,
        },
        "&:disabled": {},
        margin: theme.spacing(1),
    },
    recipientSearch: {},
}));

const PickPaymentRecipient = () => {

    const classes = useStyles();
    const recipientType = useSelector(state => state.payment.form.searchBy);
    const dispatch = useDispatch();
    const groups = useSelector(state => state.groups.groups);
    const individual = useSelector(state => state.customers.customers);
    const recipients = useSelector(state => state.payment.payment.recipients);

    const keys = Object.keys(recipients);
    let confirmButtonDisabled = true;
    for (let recipientKeyCounter = 0; recipientKeyCounter < keys.length; recipientKeyCounter++) {
        if (recipients[keys[recipientKeyCounter]].checked === true) {
            confirmButtonDisabled = false;
        }
    }

    function handleSearchBy(event) {
        dispatch(updateSearchBy(event.target.value));
        dispatch(updateSearchValue(""));
        dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    }

    function handleConfirmButtonOpen() {
        dispatch(updateConfirmRecipientsOpen(true));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    }

    return (
        <Box classes={classes.root}>
            <RecipientList/>
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup aria-label="recipientType"
                                name="recipientType"
                                value={recipientType}
                                onChange={handleSearchBy}>
                        <FormControlLabel
                            value={GROUP.toString()}
                            control={<Radio/>}
                            label="Gruppe"
                        />
                        <FormControlLabel
                            value={INDIVIDUAL.toString()}
                            control={<Radio/>}
                            label="Person"
                        />
                    </RadioGroup>
                    <RecipientSearch/>
                    <ConfirmRecipients/>
                    <Button disabled={confirmButtonDisabled}
                            variant="outlined"
                            className={classes.confirmButton}
                            onClick={handleConfirmButtonOpen}>
                        Gå videre
                    </Button>
                </FormControl>
            </form>
        </Box>
    );
};

export default PickPaymentRecipient;