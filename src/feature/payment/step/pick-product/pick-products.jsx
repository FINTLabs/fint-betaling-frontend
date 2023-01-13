import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import RecipientChipList from '../recipient-chip-list';
import ProductSearch from './product-search';
import ProductChipList from './products-chip-list';

const useStyles = makeStyles((theme) => ({
    h2: {
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: 'row',
    },
    okButton: {
        margin: theme.spacing(2),
    },
}));

const PickProducts = () => {
    const classes = useStyles();
    const aErrorHold = ''; // TODO: fix this

    return (
        <Box width="90%" mt={4}>
            <Typography variant="h3" className={classes.h2} data-testid="pageTitle">
                Velg produkt
                {aErrorHold}
            </Typography>
            <RecipientChipList />
            <ProductChipList />
            <Box sx={{ mt: 4 }}>
                <FormControl component="fieldset" fullWidth>
                    <ProductSearch />
                    <Box sx={{ mt: 2, display: 'flex' }} />
                </FormControl>
            </Box>
        </Box>
    );
};

export default PickProducts;
