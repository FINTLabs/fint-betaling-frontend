import React, { useEffect } from 'react';
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
import { GROUP, INDIVIDUAL, SEARCH_PAGE_START, STEP_PICK_PRODUCTS, } from '../../constants';
import RecipientChipList from '../recipient-chip-list';
import fetchGroup from '../../../../data/redux/actions/groups';
import fetchCustomer from '../../../../data/redux/actions/customers';
import fetchPrincipal from '../../../../data/redux/actions/principal';

const useStyles = makeStyles(() => ({
    h2: {
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: "row",
    }
}));

const PickPaymentRecipient = () => {
    const classes = useStyles();
    const recipientType = useSelector((state) => state.payment.form.searchBy);
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);


    useEffect(() => {
        if (schoolOrgId) {
            dispatch(fetchGroup(schoolOrgId));
            dispatch(fetchCustomer(schoolOrgId));
            dispatch(fetchPrincipal(schoolOrgId));
        }
    }, [dispatch, schoolOrgId]);

    function handleSearchBy(event) {
        dispatch(updateSearchBy(event.target.value));
        dispatch(updateSearchValue(''));
        dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    }


    return (
        <Box width="90%" mt={4}>
            <Typography variant="h3" className={classes.h2}>Velg mottaker</Typography>
            <RecipientChipList />
            <Box mt={4}>
                <FormControl component="fieldset" fullWidth >
                    <RadioGroup
                        className={classes.radioGroup}
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
                    <Box mt={2}>
                    <RecipientSearch />

                    </Box>
                </FormControl>
            </Box>
        </Box>
    );
};

export default PickPaymentRecipient;
