import React, {useState} from 'react';
import {Box, makeStyles, Typography, useTheme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
    root: {
        marginRight: theme.spacing(1)
    },
    organisationButton: {
        margin: theme.spacing(2),
    },
    organsationIcon: {
        marginLeft: theme.spacing(1)
    }
}));

const OrganisationSelector = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [organisation, setOrganisation] = useState("");
    const [organisations, setOrganisations] = useState(["FINTLabs", "Viken FK", "Innlandet FK"]);
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose(selectedOrganisation) {
        console.log("selectedOrganisation: ", selectedOrganisation);
        //setOrganisation(selectedOrganisation);
        setAnchorEl(null);
    }

    return (
        <Box>
            <Button className={classes.organisationButton} onClick={handleClick}>
                <Typography variant="h6" noWrap>
                    {organisation ? organisation : "Velg organisasjon"}
                </Typography>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {organisations.map(organisationChoice => (
                    <MenuItem onClick={handleClose}>{organisationChoice}</MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default OrganisationSelector;