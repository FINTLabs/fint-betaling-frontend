import React from "react";

class Amount extends React.Component {
    static currency(input) {
        let inputToInt = parseInt(input);
        let i = (inputToInt / 100) >> 0;
        let f = (inputToInt % 100) >> 0;

        if (f === 0) {
            return `${i},-`;
        }
        return `${i},${f}`;
    }

    render() {
        return (Amount.currency(this.props.children));
    }
}

export default Amount;