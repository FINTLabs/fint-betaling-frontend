import Amount from "./amount";

export function getTotalPrice(productList, productAmount) {
    let total = 0;
    const keys = Object.keys(productList);
    keys.filter(key => productList[key].checked).map(key =>{
            total += parseInt(productList[key].itemPrice) * productAmount[key].amount;
            return null;
    });
    return Amount.currency(total);
}

export function countChecked(list) {
    let count = 0;
    const keys = Object.keys(list);
    keys.filter(key => list[key].checked).map(() => {
        count++; return null;
    });
    return count;
}