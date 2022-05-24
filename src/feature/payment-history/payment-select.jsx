import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useSelector } from 'react-redux';
import { NativeSelect } from '@mui/material';
import PropTypes from 'prop-types';

const PaymentSelect = ({ onSelectSchool, onSelectDate }) => {
    const periodSelection = useSelector((state) => state.payment.payments.periodSelection);
    const schoolSelection = useSelector((state) => state.payment.payments.schoolSelection);
    const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);
    const organisationUnits = useSelector((state) => state.me.me.organisationUnits);

    return (
        <div>

            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>

                    <NativeSelect
                        defaultValue={periodSelection}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                        onChange={onSelectDate}
                    >
                        <option value="WEEK">Denne uka</option>
                        <option value="MONTH">Denne måneden</option>
                        <option value="YEAR">I år</option>
                        <option value="ALL">Alle</option>
                    </NativeSelect>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>

                    <NativeSelect
                        defaultValue={schoolSelection.length < 1 ? schoolOrgId : schoolSelection}
                        onChange={onSelectSchool}
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

PaymentSelect.propTypes = {
    onSelectSchool: PropTypes.func.isRequired,
    onSelectDate: PropTypes.func.isRequired,
};
export default PaymentSelect;
