class PaymentRepository {

    static fetchPayments() {
        const url = '/api/payment';
        return fetch(url, {
            method: "GET",
            credentials: 'same-origin',
            //headers: new Headers({'x-org-id': orgId})
        }).then(result => Promise.all([result, result.json()]))
            .catch(error => error);
    }
/*
    static getPaymentsByOrderNumber(orgId, number) {
        let url = new URL('/repository/payment/ordrenummer');
        let params = {'ordrenummer': number};
        url.search = new URLSearchParams(params);
        return fetch(url, {
            method: "GET",
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }

    static getPaymentsByLastname(orgId, lastname) {
        let url = new URL('/repository/payment/navn');
        let params = {'etternavn': lastname};
        url.search = new URLSearchParams(params);

        return fetch(url, {
            method: "GET",
            headers: new Headers({'x-org-id': orgId})
        }).then(result => {
            return result.json();
        }).catch(error => console.log(error));
    }*/

    static setPayment(orgId, customers, orderLines, mvaCode, employer, timeFrameDueDate) {
        console.log("orgId: ", orgId);
        const request = new Request('/api/payment',
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-org-id': orgId
                }),
                body: JSON.stringify({
                    mvaCode: mvaCode,
                    orderLines: orderLines,
                    customers: customers,
                    employer: employer,
                    timeFrameDueDate: timeFrameDueDate,
                })
            });

        return fetch(request).then(response => {
            return response.json()
        }).catch(error => {
            return error
        });
    }

}

export default PaymentRepository