import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RouteButton from '../../../../common/route-button';

const PaymentSaved = () => (
    <Box display="flex" flexDirection="column" p={2}>
        <Box p={2}>
            <Typography variant="h5">
                Ordrene er nå opprettet. Neste steg er å sende de til fakturering.
            </Typography>
        </Box>
        <Box p={2}>
            <RouteButton
                variant="contained"
                color="secondary"
                to="/betaling/send"
                fullWidth
            >
                Send til fakturering
            </RouteButton>
        </Box>
    </Box>
);

export default PaymentSaved;
