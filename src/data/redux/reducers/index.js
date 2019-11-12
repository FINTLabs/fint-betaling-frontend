import {combineReducers} from 'redux';
import customers from './customers';
import dates from './dates';
import employers from './employers';
import groups from './groups';
import me from './me';
import mva from './mva';
import orderlines from './orderlines';
import payments from './payments';
import payment from './payment';

export default combineReducers({
    customers,
    dates,
    employers,
    groups,
    me,
    mva,
    orderLines: orderlines,
    payments,
    payment,
});
