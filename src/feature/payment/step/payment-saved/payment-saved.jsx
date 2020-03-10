import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
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
