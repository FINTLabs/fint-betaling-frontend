const Amount = ({ children }) => {
    function currency(input) {
        const inputToInt = parseInt(input, 10);
        const i = Math.trunc(inputToInt / 100);
        const f = Math.trunc(inputToInt % 100);

        if (f === 0) {
            return `${i},-`;
        }
        return `${i},${f}`;
    }

    if (children) {
        return currency(children);
    }
    return '';
};

export default Amount;
