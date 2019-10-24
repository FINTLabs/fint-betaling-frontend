class InvoiceRepository {

    static sendOrders(orgId, orderList){
        const request = new Request('/api/invoice/send',
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-org-id': orgId
                }),
                body: JSON.stringify(
                    orderList
                )
            });
        console.log("request: ", request);

        return fetch(request).then(response => {
            console.log(response);
            return response.json()
        }).catch(error => {
            return error
        });
    }
}
export default InvoiceRepository