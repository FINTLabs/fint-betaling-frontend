import React from 'react';
import {useSelector} from "react-redux";
import PaymentsTable from "./payments_table";

const PaymentsSuggestItem = () => {
    const searchBy = useSelector(state => state.payment.payments.searchBy).toString();
    const suggestions = useSelector(state => state.payment.payments.filteredSuggestions);

    if (!suggestions) {
        return <div>loading....</div>
    }


    return (
        <PaymentsTable/>
    );
};

export default PaymentsSuggestItem;