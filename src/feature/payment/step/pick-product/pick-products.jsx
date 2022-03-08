import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import RecipientChipList from '../recipient-chip-list';
import ProductSearch from './product-search';
import ProductChipList from './products-chip-list';

const PickProducts = () => {
    const aErrorHold = ''; // TODO: fix this

    return (
        <Box width="90%" mt={4}>
            <Typography sx={{ variant: 'h3', align: 'center' }}>
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
