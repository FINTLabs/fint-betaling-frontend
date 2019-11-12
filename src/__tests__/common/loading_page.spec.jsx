import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import LoadingPage from '../../common/scaffold/loading_page';

describe('Loading page', () => {
    const initialState = {
        payment: {
            payment: {school: {}},
        },
        customers: {},
        dates: {},
        employers: {},
        groups: {},
        me: {},
        mva: {},
        orderLines: {},
        payments: {},
    };
    const mockStore = configureStore();
    it('should match snapshot', () => {
        const store = mockStore(initialState);

        const tree = renderer
            .create(<Provider store={store}><LoadingPage/></Provider>)
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
