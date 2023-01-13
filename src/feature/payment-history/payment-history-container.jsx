import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import PaymentSearch from './payment-search';

const PaymentHistoryContainer = () => {
    const pageTitle = 'Ordre historikk';
    return (
        <Box minWidth="80%" mt={4}>
            <Box
                bgcolor="grey.200"
                borderRadius={1}
                p={2}
            >
                <Box m={1}>
                    <Typography variant="h5" data-testid="pageTitle">
                        {pageTitle}
                    </Typography>
                </Box>
                <Box m={1}>
                    <Typography variant="body1">
                        Søk på skole eller dato i feltet under. Du kan også sorter og
                        filtrer ved å klikke på overskriftene.
                    </Typography>
                </Box>
            </Box>

            <PaymentSearch />

        </Box>
    );
};

export default PaymentHistoryContainer;
