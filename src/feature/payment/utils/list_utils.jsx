import React from 'react';
import Amount from './amount';

export function getTotalPrice(productList, productAmount) {
    let total = 0;
    const keys = Object.keys(productList);
    keys.filter((key) => productList[key].checked)
        .map((key) => {
            total += parseInt(productList[key].itemPrice, 10) * productAmount[key].amount;
            return null;
        });
    return <Amount>{total}</Amount>;
}

export function getCheckedCount(list) {
    return Object.keys(list)
        .filter((key) => list[key].checked).length;
}
