import axios from 'axios';
import ClaimRepository, { SEND_ORDERS_BATCH_SIZE } from '../../../data/repository/ClaimRepository';

jest.mock('axios');

describe('ClaimRepository.sendOrders', () => {
    beforeEach(() => {
        axios.post.mockReset();
    });

    it('sends a single request when 10 or fewer orders', async () => {
        const orders = [1, 2, 3];
        axios.post.mockResolvedValue({ status: 201, data: [{ orderNumber: 1 }] });

        const result = await ClaimRepository.sendOrders('org', orders);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post.mock.calls[0][1]).toEqual(orders);
        expect(result).toEqual({ status: 201, data: [{ orderNumber: 1 }], sentCount: 3 });
    });

    it('batches orders in groups of 10 and reports progress', async () => {
        const orders = Array.from({ length: 25 }, (_, index) => index + 1);
        axios.post
            .mockResolvedValueOnce({
                status: 201,
                data: orders.slice(0, 10).map((orderNumber) => ({ orderNumber })),
            })
            .mockResolvedValueOnce({
                status: 201,
                data: orders.slice(10, 20).map((orderNumber) => ({ orderNumber })),
            })
            .mockResolvedValueOnce({
                status: 201,
                data: orders.slice(20, 25).map((orderNumber) => ({ orderNumber })),
            });

        const onProgress = jest.fn();
        const result = await ClaimRepository.sendOrders('org', orders, onProgress);

        expect(axios.post).toHaveBeenCalledTimes(3);
        expect(axios.post.mock.calls[0][1]).toHaveLength(SEND_ORDERS_BATCH_SIZE);
        expect(axios.post.mock.calls[1][1]).toHaveLength(SEND_ORDERS_BATCH_SIZE);
        expect(axios.post.mock.calls[2][1]).toHaveLength(5);
        expect(result.status).toBe(201);
        expect(result.sentCount).toBe(25);
        expect(result.data).toHaveLength(25);
        expect(onProgress).toHaveBeenCalledWith({
            currentBatch: 1,
            totalBatches: 3,
            sentCount: 0,
            totalCount: 25,
            batchSize: 10,
        });
        expect(onProgress).toHaveBeenCalledWith({
            currentBatch: 3,
            totalBatches: 3,
            sentCount: 20,
            totalCount: 25,
            batchSize: 5,
        });
    });

    it('continues remaining batches and returns sent orders if a batch fails', async () => {
        const orders = Array.from({ length: 15 }, (_, index) => index + 1);
        axios.post
            .mockResolvedValueOnce({
                status: 201,
                data: orders.slice(0, 10).map((orderNumber) => ({ orderNumber })),
            })
            .mockResolvedValueOnce({
                status: 500,
                data: 'error',
            });

        const result = await ClaimRepository.sendOrders('org', orders);

        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(result.status).toBe(500);
        expect(result.sentCount).toBe(10);
        expect(result.data).toHaveLength(10);
    });

    it('counts sent orders from the request even if the response body is smaller', async () => {
        const orders = Array.from({ length: 100 }, (_, index) => index + 1);
        axios.post.mockResolvedValue({
            status: 201,
            data: [{ orderNumber: 1 }, { orderNumber: 2 }, { orderNumber: 3 }, { orderNumber: 4 }],
        });

        const result = await ClaimRepository.sendOrders('org', orders);

        expect(axios.post).toHaveBeenCalledTimes(10);
        expect(result.status).toBe(201);
        expect(result.sentCount).toBe(100);
    });
});
