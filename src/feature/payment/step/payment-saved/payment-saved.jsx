import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const PaymentSaved = () => (
    <Box display="flex" flexDirection="column" p={2}>
        <Box p={2}>
            <Typography variant="h5">
                Ordrene er nå opprettet. Neste steg er å sende de til fakturering.
            </Typography>
        </Box>
        <Box p={2}>
            <Button
                variant="contained"
                color="secondary"
                href="/betaling/send"
                fullWidth
            >
                Send til fakturering
            </Button>
        </Box>
    </Box>
);

export default PaymentSaved;
