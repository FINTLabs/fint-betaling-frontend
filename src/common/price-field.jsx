import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
    ore: {
        minWidth: 25,
        maxWidth: 25,
    },
    crown: {
        minWidth: 75,
    },
}));

const PriceField = ({
    value,
    itemCode,
    disabled,
    onChange,
}) => {
    const classes = useStyles();
    const [crowns, setCrowns] = useState(parseInt((parseInt(value, 10) / 100).toString(), 10));
    const [ore, setOre] = useState(Math.trunc(parseInt(value, 10) % 100));

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
        <Box display="flex" justifyContent="flex-end">
            <TextField
                variant="standard"
                className={classes.crown}
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
                variant="standard"
                disabled={disabled}
                value={ore === 0 ? '00' : ore}
                onChange={(e) => onOreChanged(e.target.value)}
                onBlur={(e) => onOreChanged(e.target.value.padEnd(2, '0'))}
                className={classes.ore}
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
