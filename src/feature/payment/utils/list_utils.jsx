import React from 'react';

export function getTotalPrice(productList, productAmount) {
  let total = 0;
  const keys = Object.keys(productList);
  keys.map((key) => {
    if (productList[key].checked) {
      total += parseInt(productList[key].price) * productAmount[key].amount;
    }
  });
  return (total / 100).toFixed(2);
}

export function countChecked(list) {
  let count = 0;
  const keys = Object.keys(list);
  keys.map((key) => {
    if (list[key].checked) {
      count++;
    }
  });
  return count;
}
