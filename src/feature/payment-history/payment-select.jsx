import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import { NativeSelect } from '@mui/material';
import { updatePeriodSelection, updateSchoolSelection } from '../../data/redux/actions/payment';
import fetchPayments from '../../data/redux/actions/payments';

const PaymentSelect = () => {
    const periodSelection = useSelector((state) => state.payment.payments.periodSelection);
    const schoolSelection = useSelector((state) => state.payment.payments.schoolSelection);
    const organisationUnits = useSelector((state) => state.me.me.organisationUnits);
    const dispatch = useDispatch();

    function handleSelectDate(event) {
        dispatch(updatePeriodSelection(event.target.value));
        dispatch(fetchPayments(event.target.value, schoolSelection));
    }

    function handleSelectSchool(event) {
        if (event && event.target.value === '0') {
            // setHideSchoolCol(false);
            dispatch(updateSchoolSelection('0'));
            dispatch(fetchPayments(periodSelection));
        } else {
            // setHideSchoolCol(true);
            dispatch(updateSchoolSelection(event.target.value));
            dispatch(fetchPayments(periodSelection, event.target.value));
        }
    }

    return (
        <div>

            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>

                    <NativeSelect
                        data-testid="selectDate"
                        defaultValue={periodSelection}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                        // onChange={handleSelectDate}
                        onChange={(e) => {
                            handleSelectDate(e);
                        }}
                    >
                        <option value="WEEK">Denne uka</option>
                        <option value="MONTH">Denne måneden</option>
                        <option value="YEAR">I år</option>
                        <option value="ALL">Alle</option>
                    </NativeSelect>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>

                    <NativeSelect
                        data-testid="selectSchool"
                        defaultValue={schoolSelection.length < 1 ? '0' : schoolSelection}
                        // onChange={handleSelectSchool}
                        onChange={(e) => {
                            handleSelectSchool(e);
                        }}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                    >
                        <option value="0">Alle</option>
                        {organisationUnits && organisationUnits.map((o) => (
                            <option
                                key={o.organisationNumber}
                                value={o.organisationNumber}
                            >
                                {o.name}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>

            </Box>

        </div>
    );
};

export default PaymentSelect;
