import React from 'react';
import {Box, makeStyles} from '@material-ui/core';
import CardMenu from './card_menu/card_menu';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        width: '100%',
    },
}));

const DashboardContainer = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <CardMenu/>
        </Box>
    );
};

export default DashboardContainer;
