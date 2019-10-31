import renderer from 'react-test-renderer';
import React from 'react';
import DashboardContainer from '../../../feature/dashboard/dashboard_container';

jest.mock('../../../feature/dashboard/card_menu/card_menu', () => () => 'cardmenu');
jest.mock('../../../feature/dashboard/payment_information/payment_information_list', () => () => 'paymentlist');

describe('Dashboard container', () => {
  it('should match the snapshot', () => {
    const tree = renderer.create(<DashboardContainer />)
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });
});
