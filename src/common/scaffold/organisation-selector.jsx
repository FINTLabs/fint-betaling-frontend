import React, {useState} from 'react';
import {Box, makeStyles, Typography,} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import {setSchool, setSchoolOrgId, updateCustomersLoaded, updateGroupsLoaded} from "../../data/redux/actions/payment";

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "auto",
    },
    organisationButton: {
        margin: theme.spacing(2),
    },
    organsationIcon: {
        marginLeft: theme.spacing(1),
    },
}));

const OrganisationSelector = () => {
    const classes = useStyles();
    const school = useSelector(state => state.payment.payment.school);
    const organisationUnits = useSelector(state => state.me.me.organisationUnits);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleSchoolClick(school, schoolOrgId) {
        dispatch(setSchool(school));localStorage.setItem("school", school);
        dispatch(setSchoolOrgId(schoolOrgId)); localStorage.setItem("schoolOrgId", schoolOrgId);
        dispatch(updateGroupsLoaded(false));
        dispatch(updateCustomersLoaded(false));
        setAnchorEl(null);
    }

    function handleClose(event) {
        setAnchorEl(null);
    }

    return (
        <Box className={classes.root}>
            <Button className={classes.organisationButton} onClick={handleClick}>
                <Typography variant="h6" noWrap>
                    {school || 'Velg organisasjon'}
                </Typography>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {organisationUnits.map((o) => (
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
