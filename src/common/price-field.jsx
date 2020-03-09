import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, TextField } from '@material-ui/core';

const PriceField = ({
    value, itemCode, disabled, onChange,
}) => {
    const [crowns, setCrowns] = useState(value);
    const [ore, setOre] = useState('00');

    function toOres(c, o) {
        return parseInt(c, 10) * 100 + parseInt(o, 10);
    }

    function onCrownsChanged(c) {
        setCrowns(c);
        onChange(toOres(c, ore), itemCode);
    }

    function onOreChanged(o) {
        setOre(o);
        onChange(toOres(crowns, o), itemCode);
    }


    return (
        <Box width="100%" display="flex" justifyContent="flex-end">
            <TextField
                disabled={disabled}
                value={crowns}
                onChange={(e) => onCrownsChanged(e.target.value)}
                inputProps={{ style: { textAlign: 'end' } }}
                /* eslint-disable-next-line react/jsx-no-duplicate-props */
                InputProps={{
                    endAdornment: <Box color="text.disabled" ml={1} mr={1}>|</Box>,
                }}
            />
            <TextField
                disabled={disabled}
                value={ore}
                onChange={(e) => onOreChanged(e.target.value)}
                onBlur={(e) => onOreChanged(e.target.value.padEnd(2, '0'))}
                inputProps={{ style: { width: '30px' } }}
            />
        </Box>
    );
};

PriceField.defaultProps = {
    disabled: false,
};

PriceField.propTypes = {
    disabled: PropTypes.bool,
    itemCode: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default PriceField;
