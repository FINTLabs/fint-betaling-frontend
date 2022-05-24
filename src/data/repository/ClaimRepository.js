class ClaimRepository {
    static fetchPaymentsStatusCount(statusToGet) {
        const url = `/api/claim/count/by-status/${statusToGet}`;
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

    static fetchPayments(periodSelection, orgIdSelection, status) {
        const stopFetch = 15;

        const buildSearchParams = new URLSearchParams();
        if (periodSelection != null && periodSelection.length > 0) {
            buildSearchParams.append('periodSelection', periodSelection);
        }

        if (orgIdSelection != null && orgIdSelection.length > 0 && orgIdSelection !== '0') {
            buildSearchParams.append('schoolSelection', orgIdSelection);
        }

        if (status != null && status.length > 0) {
            buildSearchParams.append('status', status);
        }

        const searchParams = buildSearchParams.toString();
        const url = `/api/claim/?${searchParams}`;

        console.log('Fetching payments from:', url);
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
        const apiAddress = '/api/claim/order-number/';
        const urls = [];
        orderNumbers.forEach((orderNumber) => urls.push(apiAddress + orderNumber));
        const stopFetch = 15;
        return Promise.allSettled(urls.map((url) => fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            credentials: 'same-origin',
            retryOn(attempt, error, response) {
                return (error !== null || response.status >= 400) && attempt <= stopFetch;
            },
        })));
    }
}

export default ClaimRepository;
