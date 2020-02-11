import PropTypes from 'prop-types';
import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { grey } from '@material-ui/core/colors';
import ClearIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

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
