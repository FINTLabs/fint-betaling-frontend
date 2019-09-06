class OrderLineApi {

    static fetchOrderLines(orgId) {
        const url = '/repository/orderline';
        return fetch(url, {
            method: 'GET',
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }
}

export default OrderLineApi