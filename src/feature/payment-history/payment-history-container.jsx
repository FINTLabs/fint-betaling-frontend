import React, {useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from 'react-redux';
import {Typography} from '@material-ui/core';
import {CUSTOMER_NAME, ORDER_NUMBER} from '../payment/constants';
import PaymentSearch from './payment-search';
import {
    updateNeedFetch,
    updatepaymentOnlyMeSearch,
    updatePaymentsSearchBy,
    updatePaymentsSearchValue,
    updateSearchPage
} from '../../data/redux/actions/payment';
import fetchPayments from '../../data/redux/actions/payments';
import FilterSelect from './filter-selection';
import ShowOnlyMeCheckBox from "./show-only-me-check-box";
import {makeStyles} from "@material-ui/core/styles";
import FilterDate from "./filter-date";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: "100%",
        alignItems: "center",
    },
    onlyMeCheckbox: {
        alignSelf: "flex-end",
    },
}));

const PaymentHistoryContainer = () => {
    const searchBy = useSelector((state) => state.payment.payments.searchBy);
    const searchOnlyMe = useSelector((state) => state.payment.payments.searchOnlyMe);
    const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [dateChecked, setDateChecked] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();

    if (needsFetch) {
        dispatch(fetchPayments());
        dispatch(updateNeedFetch(false));
    }

    function handleSearchBy(event) {
        dispatch(updatePaymentsSearchBy(event.target.value));
        dispatch(updatePaymentsSearchValue(''));
    }

    function handleOnlyMeCheck(event) {
        dispatch(updatepaymentOnlyMeSearch(event.target.checked))
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
        dispatch(updateSearchPage(0));
    };

    function handleDateChecked() {
        setDateChecked(!dateChecked);
    }

    return (
        <Box minWidth="80%" mt={4}>
            <Box
                bgcolor="grey.200"
                borderRadius="borderRadius"
                p={2}
            >
                <Box m={1}>
                    <Typography variant="h5">
                        Ordre historikk
                    </Typography>
                </Box>
                <Box m={1}>
                    <Typography variant="body1">
                        Søk på ordrenummer eller navn i feltet under. Du kan filtrere på status, ordrenummer, navn og
                        tidspunkt.
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt={3}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup
                        aria-label="recipientType"
                        name="recipientType"
                        value={searchBy}
                        onChange={handleSearchBy}
                    >
                        <Box ml={2} display={"flex"} flexDirection={"column"}>
                            <FormControlLabel value={ORDER_NUMBER.toString()} control={<Radio/>} label="Ordrenummer"/>
                            <FormControlLabel value={CUSTOMER_NAME.toString()} control={<Radio/>} label="Navn"/>
                        </Box>
                    </RadioGroup>
                    <Box mt={2} display={"flex"} flexDirection={"row"} width={"100%"} justifyContent={"space-between"}
                         alignItems={"flex-end"}>
                        <FilterSelect/>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                                <Checkbox checked={dateChecked} onChange={handleDateChecked}></Checkbox>
                                <Typography>Velg dato</Typography>
                            </Box>
                            <FilterDate selectedDate={selectedDate} handleDateChange={handleDateChange}
                                        disabled={!dateChecked}/>
                        </Box>
                        <ShowOnlyMeCheckBox classes={classes} handleOnlyMeCheck={handleOnlyMeCheck}
                                            checked={searchOnlyMe}/>
                    </Box>
                </FormControl>
            </Box>
            <PaymentSearch selectedDate={selectedDate} dateChecked={dateChecked}/>

        </Box>
    );
};

export default PaymentHistoryContainer;
