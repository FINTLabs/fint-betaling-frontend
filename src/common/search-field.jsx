import PropTypes from 'prop-types';
import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { grey } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
    clearIcon: {
        color: grey[400],
        cursor: 'pointer',
    },
    searchIcon: {
        color: grey[600],
    },
}));
const SearchField = ({
    value,
    label,
    onChange,
    onClear,
}) => {
    const classes = useStyles();
    return (
        <TextField
            id="standard-name"
            label={label}
            value={value}
            onChange={onChange}
            margin="normal"
            variant="outlined"
            fullWidth
            autoFocus
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon className={classes.searchIcon} />
                    </InputAdornment>
                ),
                endAdornment: value ? (
                    <InputAdornment position="end">
                        <ClearIcon onClick={onClear} className={classes.clearIcon} />
                    </InputAdornment>
                ) : '',
            }}
        />
    );
};

SearchField.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default SearchField;
