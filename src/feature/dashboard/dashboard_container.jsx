import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomer} from "../../data/redux/actions/customers";
import {fetchDate} from "../../data/redux/actions/dates";
import {fetchEmployer} from "../../data/redux/actions/employers";
import {fetchGroup} from "../../data/redux/actions/groups";
import {fetchMe} from "../../data/redux/actions/me";
import {fetchMva} from "../../data/redux/actions/mva";
import {fetchOrderLines} from "../../data/redux/actions/orderlines";
import {fetchPayment} from "../../data/redux/actions/payments";
import {Box, makeStyles} from "@material-ui/core";
import PaymentInformationList from "./payment_information/payment_information_list";
import CardMenu from "./card_menu/card_menu";

const useStyles = makeStyles(theme => ({
    root: {
        margin: "auto",
        width: '100%',
        overflowX: 'auto',
    },
}));

const DashboardContainer = () => {

    const customers = useSelector(state => state.customers);
    const dates = useSelector(state => state.dates);
    const employers = useSelector(state => state.employers);
    const groups = useSelector(state => state.groups);
    const me = useSelector(state => state.me);
    const mva = useSelector(state => state.mva);
    const orderLines = useSelector(state => state.orderLines);
    const payments = useSelector(state => state.payments);

    const dispatch = useDispatch();

    const classes = useStyles();


    useEffect(() => {
        dispatch(fetchCustomer());
        dispatch(fetchDate());
        dispatch(fetchEmployer());
        dispatch(fetchGroup());
        dispatch(fetchMe());
        dispatch(fetchMva());
        dispatch(fetchOrderLines());
        dispatch(fetchPayment());
    }, [dispatch]);

    if (
        customers.isLoading ||
        dates.isLoading ||
        employers.isLoading ||
        groups.isLoading ||
        me.isLoading ||
        mva.isLoading ||
        orderLines.isLoading ||
        payments.isLoading
    ) {
        return (<div>Loading...</div>)
    } else {

        return (
            <Box className={classes.root}>
                <CardMenu/>
                <PaymentInformationList/>
            </Box>
        );
    }
};

export default DashboardContainer;