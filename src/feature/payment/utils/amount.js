import React from 'react';

class Amount extends React.Component {
  static currency(input) {
    const inputToInt = parseInt(input, 10);
    /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
    const i = (inputToInt / 100) >> 0;
    const f = (inputToInt % 100) >> 0;

    if (f === 0) {
      return `${i},-`;
    }
    return `${i},${f}`;
  }

  render() {
    const { children } = this.props;
    return (Amount.currency(children));
  }
}

export default Amount;
