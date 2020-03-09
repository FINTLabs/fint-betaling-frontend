import { combineReducers } from 'redux';
import customers from './customers';
import dates from './dates';
import principal from './principal';
import groups from './groups';
import me from './me';
import mva from './mva';
import payments from './payments';
import payment from './payment';

export default combineReducers({
    customers,
    dates,
    principal,
    groups,
    me,
    mva,
    payments,
    payment,
});
