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
                body: JSON.stringify(
                    orderList,
                ),
            });

        return fetch(request)
            .then((response) => response.json())
            .catch((error) => error);
    }

    static setPayment(
        orgId,
        customers,
        orderItems,
        requestedNumberOfDaysToPaymentDeadline,
        organisationUnit,
        principal,
        createdBy,
    ) {
        const request = new Request('/api/claim',
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-org-id': orgId,
                }),
                body: JSON.stringify({ // Todo create Order from model
                    orderItems,
                    customers,
                    requestedNumberOfDaysToPaymentDeadline,
                    organisationUnit,
                    principal,
                    createdBy,
                }),
            });

        return fetch(request)
            .then((response) => response.json())
            .catch((error) => error);
    }
}

export default ClaimRepository;
