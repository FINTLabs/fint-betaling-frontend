import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useSelector } from 'react-redux';
import { NativeSelect } from '@mui/material';
import PropTypes from 'prop-types';

const PaymentSelect = ({ onSelectSchool }) => {
    const [date, setDate] = React.useState('10');
    const [school, setSchool] = React.useState('10');
    const selectedSchool = useSelector((state) => state.payment.payment.school);

    const handleChange = (event) => {
        setSchool(Number(event.target.value) || '');
        onSelectSchool(event.target.value);
    };

    const handleChangeDate = (event) => {
        setDate(Number(event.target.value) || '');
    };

    return (
        <div>

            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>

                    <NativeSelect
                        defaultValue={date}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                        onChange={handleChangeDate}
                    >
                        <option value={10}>Denne uka</option>
                        <option value={20}>Denne måneden</option>
                        <option value={30}>I år</option>
                        <option value={40}>I år og i fjor</option>
                        <option value={40}>Alle</option>
                    </NativeSelect>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>

                    <NativeSelect
                        defaultValue={school}
                        onChange={handleChange}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                    >
                        <option value={0}>Alle</option>
                        <option value={10}>{selectedSchool}</option>
                        <option value={20}>skole 2</option>
                        <option value={30}>skole 3</option>
                    </NativeSelect>
                </FormControl>

            </Box>

        </div>
    );
};

PaymentSelect.propTypes = {
    onSelectSchool: PropTypes.func.isRequired,
};
export default PaymentSelect;
