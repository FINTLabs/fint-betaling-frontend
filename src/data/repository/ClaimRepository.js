class ClaimRepository {
    static fetchPayments() {
        const url = '/api/claim';
        return fetch(url, {
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

    static setPayment(orgId, customers, orderLines, principalUri, requestedNumberOfDaysToPaymentDeadline) {
        const request = new Request('/api/claim',
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-org-id': orgId,
                }),
                body: JSON.stringify({
                    orderLines,
                    customers,
                    principalUri,
                    requestedNumberOfDaysToPaymentDeadline,
                }),
            });

        return fetch(request)
            .then((response) => response.json())
            .catch((error) => error);
    }
}

export default ClaimRepository;
