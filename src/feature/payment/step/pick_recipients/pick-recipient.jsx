import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import RecipientSearch from './recipient-search';
import {
    updateSearchBy,
    updateSearchPage,
    updateSearchValue,
    updateStep,
    updateSuggestions,
} from '../../../../data/redux/actions/payment';
import {
    GROUP, INDIVIDUAL, SEARCH_PAGE_START, STEP_PICK_PRODUCTS,
} from '../../constants';
import RecipientChipList from '../recipient-chip-list';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    h2: {
        textAlign: 'center',
    },
    formControl: {
        minWidth: '70%',
        maxWidth: '70%',
        margin: theme.spacing(3),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const PickPaymentRecipient = () => {
    const classes = useStyles();
    const recipientType = useSelector((state) => state.payment.form.searchBy);
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const recipients = useSelector((state) => state.payment.payment.recipients);

    const keys = Object.keys(recipients);
    let confirmButtonDisabled = true;
    for (let recipientKeyCounter = 0; recipientKeyCounter < keys.length; recipientKeyCounter++) {
        if (recipients[keys[recipientKeyCounter]].checked === true) {
            confirmButtonDisabled = false;
        }
    }

    function handleSearchBy(event) {
        dispatch(updateSearchBy(event.target.value));
        dispatch(updateSearchValue(''));
        dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    }

    function handleConfirmButtonClick() {
        dispatch(updateStep(STEP_PICK_PRODUCTS));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    }

    return (
        <Box mt={4}>
            <Typography variant="h3" className={classes.h2}>Velg mottaker</Typography>
            <RecipientChipList />
            <form className={classes.container}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup
                        aria-label="recipientType"
                        name="recipientType"
                        value={recipientType}
                        onChange={handleSearchBy}
                    >
                        <FormControlLabel
                            value={GROUP.toString()}
                            control={<Radio />}
                            label="Gruppe"
                        />
                        <FormControlLabel
                            value={INDIVIDUAL.toString()}
                            control={<Radio />}
                            label="Person"
                        />
                    </RadioGroup>
                    <RecipientSearch />
                    <Box mt={2}>
                        <Button
                            disabled={confirmButtonDisabled}
                            variant="contained"
                            color="secondary"
                            onClick={handleConfirmButtonClick}
                        >
                            Gå videre
                        </Button>
                    </Box>
                </FormControl>
            </form>
        </Box>
    );
};

export default PickPaymentRecipient;
