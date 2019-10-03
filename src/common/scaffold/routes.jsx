import React from 'react';
import {Route} from "react-router-dom";
import DashboardContainer from "../../feature/dashboard/dashboard_container";
import PaymentContainer from "../../feature/payment/payment_container";
import PaymentHistoryContainer from "../../feature/payment_history/payment_history_container";
import LogOutContainer from "../../feature/log_out/log_out_container";


const Routes = () => {
    return (
        <div>
            <Route exact path='/' component={DashboardContainer}/>
            <Route exact path='/betaling' component={PaymentContainer}/>
            <Route exact path='/betalinger' component={PaymentHistoryContainer}/>
            <Route exact path='/logg-ut' component={LogOutContainer}/>
        </div>

    );
};

export default Routes;