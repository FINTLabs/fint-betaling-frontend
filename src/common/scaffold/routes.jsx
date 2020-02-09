import React from 'react';
import { Route } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import DashboardContainer from '../../feature/dashboard/dashboard-container';
import PaymentContainer from '../../feature/payment/payment-container';
import PaymentHistoryContainer from '../../feature/payment_history/payment_history_container';
import LogOutContainer from '../../feature/log_out/log_out_container';
import SendToInvoiceContainer from '../../feature/payment/send_payment_to_invoice/send_to_invoice_container';
import SentToExternalContainer from '../../feature/payment/sent_payment_to_external/sent_to_external_container';


const Routes = () => (
    <Box display="flex" flexDirection="column" alignItems="center">
        <Route exact path="/" component={DashboardContainer} />
        <Route exact path="/betaling/ny" component={PaymentContainer} />
        <Route exact path="/betaling/historikk" component={PaymentHistoryContainer} />
        <Route exact path="/betaling/send" component={SendToInvoiceContainer} />
        <Route exact path="/betaling/sendt" component={SentToExternalContainer} />
        <Route exact path="/logg-ut" component={LogOutContainer} />

    </Box>

);

export default Routes;
