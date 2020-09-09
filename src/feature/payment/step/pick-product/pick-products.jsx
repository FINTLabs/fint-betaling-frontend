import React from 'react';
import {makeStyles, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import RecipientChipList from '../recipient-chip-list';
import ProductSearch from './product-search';
import ProductChipList from './products-chip-list';

const useStyles = makeStyles(() => ({
    h2: {
        textAlign: 'center',
    },
}));

const PickProducts = () => {
    const classes = useStyles();

    return (
        <Box width="90%" mt={4}>
            <Typography variant="h3" className={classes.h2}>Velg produkt</Typography>
            <RecipientChipList/>
            <ProductChipList/>
            <Box mt={4}>
                <FormControl component="fieldset" fullWidth>
                    <ProductSearch/>
                    <Box mt={2} display="flex">


                    </Box>
                </FormControl>
            </Box>
        </Box>
    );
};

export default PickProducts;
