import React from 'react';
import { Route } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import DashboardContainer from '../../feature/dashboard/dashboard-container';
import PaymentContainer from '../../feature/payment/payment-container';
import PaymentHistoryContainer from '../../feature/payment-history/payment-history-container';
import SendToInvoiceContainer from '../../feature/payment/send-payment-to-invoice/send-to-invoice-container';
import SentToExternalContainer from '../../feature/payment/sent-payment-to-external/sent-to-external-container';
import PriceField from '../price-field';


const Routes = () => (
    <Box display="flex" flexDirection="column" alignItems="center">
        <Route exact path="/" component={DashboardContainer} />
        <Route exact path="/betaling/ny" component={PaymentContainer} />
        <Route exact path="/betaling/historikk" component={PaymentHistoryContainer} />
        <Route exact path="/betaling/send" component={SendToInvoiceContainer} />
        <Route exact path="/betaling/sendt" component={SentToExternalContainer} />
        <Route exact path="/test" component={PriceField} />

    </Box>

);

export default Routes;
