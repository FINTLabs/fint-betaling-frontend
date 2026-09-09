// class ClaimRepository {
//     static fetchPaymentsStatusCount(statusToGet, days) {
//         const stopFetch = 15;
//         const buildSearchParams = new URLSearchParams();
//
//         if (days != null) {
//             buildSearchParams.append('days', days);
//         }
//         const searchParams = buildSearchParams.toString();
//
//         const url = `/api/claim/count/by-status/${statusToGet}?${searchParams}`;
//         return fetch(url, {
//
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             credentials: 'same-origin',
//             // headers: new Headers({'x-org-id': orgId})
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
//
//     static fetchPayments(periodSelection, orgIdSelection, status) {
//         const stopFetch = 15;
//
//         const buildSearchParams = new URLSearchParams();
//         if (periodSelection != null && periodSelection.length > 0) {
//             buildSearchParams.append('periodSelection', periodSelection);
//         }
//
//         if (orgIdSelection != null && orgIdSelection.length > 0 && orgIdSelection !== '0') {
//             buildSearchParams.append('schoolSelection', orgIdSelection);
//         }
//
//         if (status != null && status.length > 0) {
//             buildSearchParams.append('status', status);
//         }
//
//         const searchParams = buildSearchParams.toString();
//         const url = `/api/claim?${searchParams}`;
//
//         return fetch(url, {
//
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//             method: 'GET',
//             credentials: 'same-origin',
//             // headers: new Headers({'x-org-id': orgId})
//         })
//             .then((result) => Promise.all([result, result.json()]))
//             .catch((error) => error);
//     }
//
//     static sendOrders(orgId, orderList) {
//         const request = new Request(
//             '/api/claim/send',
//             {
//                 method: 'POST',
//                 headers: new Headers({
//                     'Content-Type': 'application/json',
//                     'x-org-id': orgId,
//                 }),
//                 body: JSON.stringify(orderList),
//             },
//         );
//
//         return fetch(request)
//             .then((response) => Promise.all([response, response.json()]));
//     }
//
//     static setPayment(
//         orgId,
//         customers,
//         orderItems,
//         organisationUnit,
//         principal,
//         createdBy,
//     ) {
//         const request = new Request(
//             '/api/claim',
//             {
//                 method: 'POST',
//                 headers: new Headers({
//                     'Content-Type': 'application/json',
//                 }),
//                 body: JSON.stringify({ // Todo create Order from model
//                     orderItems,
//                     customers,
//                     organisationUnit,
//                     principal,
//                     createdBy,
//                 }),
//             },
//         );
//         return fetch(request)
//             .then((response) => response.json())
//             .catch((error) => error);
//     }
//
//     static cancelPayments(orderNumbers) {
//         const apiAddress = '/api/claim/order-number/';
//         const urls = [];
//         orderNumbers.forEach((orderNumber) => urls.push(apiAddress + orderNumber));
//         const stopFetch = 15;
//         return Promise.allSettled(urls.map((url) => fetch(url, {
//             method: 'DELETE',
//             headers: new Headers({
//                 'Content-Type': 'application/json',
//             }),
//             credentials: 'same-origin',
//             retryOn(attempt, error, response) {
//                 return (error !== null || response.status >= 400) && attempt <= stopFetch;
//             },
//         })));
//     }
// }
//
// export default ClaimRepository;
import axios from 'axios';

export const SEND_ORDERS_BATCH_SIZE = 10;

class ClaimRepository {
    static fetchPaymentsStatusCount(statusToGet, days) {
        const stopFetch = 15;
        const params = new URLSearchParams();

        if (days != null) {
            params.append('days', days);
        }

        const url = `/api/claim/count/by-status/${statusToGet}?${params.toString()}`;

        return axios.get(url, {
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }

    static fetchPayments(periodSelection, orgIdSelection, status) {
        const stopFetch = 15;
        const params = new URLSearchParams();

        if (periodSelection != null && periodSelection.length > 0) {
            params.append('periodSelection', periodSelection);
        }

        if (orgIdSelection != null && orgIdSelection.length > 0 && orgIdSelection !== '0') {
            params.append('schoolSelection', orgIdSelection);
        }

        if (status != null && status.length > 0) {
            params.append('status', status);
        }

        const url = `/api/claim?${params.toString()}`;

        return axios.get(url, {
            retry: stopFetch,
            retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
        })
            .then((response) => response.data)
            .catch((error) => error);
    }

    static sendOrders(orgId, orderList, onProgress) {
        const batchSize = SEND_ORDERS_BATCH_SIZE;
        const orders = Array.isArray(orderList) ? orderList : [];
        const totalCount = orders.length;
        const batches = [];

        for (let i = 0; i < totalCount; i += batchSize) {
            batches.push(orders.slice(i, i + batchSize));
        }

        const totalBatches = batches.length || 1;

        const notifyProgress = (index, sentCount, currentBatchSize) => {
            if (typeof onProgress === 'function') {
                onProgress({
                    currentBatch: index + 1,
                    totalBatches,
                    sentCount,
                    totalCount,
                    batchSize: currentBatchSize,
                });
            }
        };

        const sendBatch = (batch) => axios.post('/api/claim/send', batch, {
            headers: {
                'Content-Type': 'application/json',
                'x-org-id': orgId,
            },
        })
            .then((response) => ({
                status: response.status,
                data: response.data,
            }))
            .catch((error) => ({
                status: error.response && error.response.status,
                data: [],
                error,
            }));

        const toArray = (payload) => {
            if (Array.isArray(payload)) {
                return payload;
            }
            if (payload == null) {
                return [];
            }
            return [payload];
        };

        if (batches.length === 0) {
            return Promise.resolve({ status: 201, data: [], sentCount: 0 });
        }

        return batches.reduce(
            (promise, batch, index) => promise.then((accumulated) => {
                notifyProgress(index, accumulated.sentCount, batch.length);

                return sendBatch(batch).then((result) => {
                    if (result.status === 201) {
                        return {
                            status: accumulated.failed ? accumulated.status : 201,
                            data: accumulated.data.concat(toArray(result.data)),
                            sentCount: accumulated.sentCount + batch.length,
                            failed: accumulated.failed,
                        };
                    }

                    return {
                        status: accumulated.failed ? accumulated.status : result.status,
                        data: accumulated.data,
                        sentCount: accumulated.sentCount,
                        failed: true,
                    };
                });
            }),
            Promise.resolve({
                status: 201,
                data: [],
                sentCount: 0,
                failed: false,
            }),
        ).then((result) => ({
            status: result.status,
            data: result.data,
            sentCount: result.sentCount,
        }));
    }

    static setPayment(orgId, customers, orderItems, organisationUnit, principal, createdBy) {
        const data = {
            orderItems,
            customers,
            organisationUnit,
            principal,
            createdBy,
        };

        return axios.post('/api/claim', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.data)
            .catch((error) => error);
    }

    static cancelPayments(orderNumbers) {
        const apiAddress = '/api/claim/order-number/';
        const stopFetch = 15;

        const cancelRequests = orderNumbers.map((orderNumber) => {
            const url = `${apiAddress}${orderNumber}`;
            return axios.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
                retry: stopFetch,
                retryDelay: (retryCount) => retryCount * 1000, // retry after 1s, 2s, 3s, ...
            });
        });

        return axios.all(cancelRequests)
            .then(axios.spread((...responses) => responses.map((response) => response.data)))
            .catch((error) => error);
    }

    static updateClaimStatus(periodSelection, schoolSelection) {
        return axios.post('/api/claim/update/status', {
            periodSelection,
            schoolSelection,
        })
            .then((response) => response.data)
            .catch((error) => error);
    }
}

export default ClaimRepository;
