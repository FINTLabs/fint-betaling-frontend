import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import CardMenu from './card-menu';

const useStyles = makeStyles(() => ({
    root: {
        margin: 'auto',
        width: '100%',
    },
}));

const DashboardContainer = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <CardMenu />
        </Box>
    );
};

export default DashboardContainer;
