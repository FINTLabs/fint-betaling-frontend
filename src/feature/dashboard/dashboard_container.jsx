import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomer} from "../../data/redux/actions/customers";

const DashboardContainer = () => {

    const customers = useSelector(state => state.customers)
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchCustomer());
    }, [dispatch]);

    if (customers.isLoading) {
        return (<div>Loading...</div>)
    } else {

        return (
            <div>
                Dashboard
            </div>
        );
    }
};

export default DashboardContainer;