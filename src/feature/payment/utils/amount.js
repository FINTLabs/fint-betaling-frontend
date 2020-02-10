import React from 'react';

class Amount extends React.Component {
  static currency(input) {
    const inputToInt = parseInt(input, 10);
    const i = Math.trunc(inputToInt / 100);
    const f = Math.trunc(inputToInt % 100);

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
