import React from 'react';
import Amount from './amount';

export function getTotalPrice(productList, productPrice, productAmount) {
    let total = 0;
    const keys = Object.keys(productList);
    keys.filter((key) => productList[key].checked)
        .map((key) => {
            total += (parseInt(productAmount[key].amount, 10) * parseInt(productPrice[key].itemPrice, 10));
            return null;
        });
    return <Amount>{total}</Amount>;
}

export function getCheckedCount(list) {
    return Object.keys(list)
        .filter((key) => list[key].checked).length;
}
