import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import OrganisationIcon from '@mui/icons-material/Domain';
import Divider from '@mui/material/Divider';
import { setSchool, setSchoolOrgId } from '../../data/redux/actions/payment';

const useStyles = makeStyles((theme) => ({
    organisationButton: {
        margin: theme.spacing(1),
        color: '#000',
    },
    organsationIcon: {
        marginLeft: theme.spacing(1),
    },
}));

const OrganisationSelector = () => {
    const classes = useStyles();
    const school = useSelector((state) => state.payment.payment.school);
    const organisationUnits = useSelector((state) => state.me.me.organisationUnits);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    function handleSchoolClick(selectedSchool, schoolOrgId) {
        dispatch(setSchool(selectedSchool));
        dispatch(setSchoolOrgId(schoolOrgId));
        localStorage.setItem('school', selectedSchool);
        localStorage.setItem('schoolOrgId', schoolOrgId);
        // dispatch(updateGroupsLoaded(false));
        // dispatch(updateCustomersLoaded(false));
        setAnchorEl(null);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box display="flex" justifyContent="flex-end">
            <Button className={classes.organisationButton} onClick={handleClick}>
                {organisationUnits ? school : <CircularProgress color="secondary" size={25} />}
                <OrganisationIcon className={classes.organsationIcon} />
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                <MenuItem disabled>
                    Velg skole
                </MenuItem>
                <Divider />
                {organisationUnits && organisationUnits.map((o) => (
                    <MenuItem
                        key={o.organisationNumber}
                        onClick={() => handleSchoolClick(o.name, o.organisationNumber)}
                    >
                        {o.name}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default OrganisationSelector;
