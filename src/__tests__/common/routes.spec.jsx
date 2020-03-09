import React from 'react';
import renderer from 'react-test-renderer';
import {BrowserRouter} from 'react-router-dom';
import Routes from '../../common/scaffold/routes';

jest.mock('../../feature/dashboard/dashboard_container', () => () => 'dashboard');
jest.mock('../../feature/payment/payment_container', () => () => 'payment');
jest.mock('../../feature/payment-history/payment_history_container', () => () => 'history');
jest.mock('../../feature/log_out/log_out_container', () => () => 'logout');
jest.mock('../../feature/payment/send-payment-to-invoice/send_to_invoice_container', () => () => 'send');
jest.mock('../../feature/payment/sent-payment-to-external/sent_to_external_container', () => () => 'sents');

describe('Routes', () => {
    it('should match snapshot', () => {
        const tree = renderer.create(
            <BrowserRouter basename="/">
                <Routes/>
            </BrowserRouter>,
        )
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
