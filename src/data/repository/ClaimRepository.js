class ClaimRepository {
    static fetchPayments() {
        const url = '/api/claim';
        const stopFetch = 15;

        return fetch(url, {

            retryOn(attempt, error, response) {
                return (error !== null || response.status >= 400) && attempt <= stopFetch;
            },
            method: 'GET',
            credentials: 'same-origin',
            // headers: new Headers({'x-org-id': orgId})
        })
            .then((result) => Promise.all([result, result.json()]))
            .catch((error) => error);
    }

    static sendOrders(orgId, orderList) {
        const request = new Request('/api/claim/send',
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-org-id': orgId,
                }),
                body: JSON.stringify(orderList),
            });

        return fetch(request)
            .then((response) => Promise.all([response, response.json()]));
    }

    static setPayment(
        orgId,
        customers,
        orderItems,
        organisationUnit,
        principal,
        createdBy,
    ) {
        const request = new Request('/api/claim',
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({ // Todo create Order from model
                    orderItems,
                    customers,
                    organisationUnit,
                    principal,
                    createdBy,
                }),
            });
        return fetch(request)
            .then((response) => response.json())
            .catch((error) => error);
    }

    static cancelPayments(orderNumbers) {
        const url = '/api/claim/order-number/';
        const stopFetch = 15;
        return Promise.all([orderNumbers.map(key=> {
            return fetch(url + key, {

                retryOn(attempt, error, response) {
                    return (error !== null || response.status >= 400) && attempt <= stopFetch;
                },
                method: 'DELETE',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
                credentials: 'same-origin',
            })
        })]);
    }
}

export default ClaimRepository;
