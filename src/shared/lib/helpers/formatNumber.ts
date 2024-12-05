export function preciseAmount(amount: number, precision: number = 2): number {
    return +amount.toFixed(precision);
}

export function formatNumber(amount: string | number | undefined, precision: number = 2): string {
    if (amount === undefined) return "-";
    let amountAsNumber = parseFloat(amount.toString());
    if (isNaN(amountAsNumber)) return "-";
    amountAsNumber = preciseAmount(amountAsNumber, precision);

    const formattedValue = amountAsNumber.toString();

    return formattedValue.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.$/, "");
    // .slice(0, 8);
}

export function formatTokenAmount(amount: string): string {
    const amountAsNumber = parseFloat(amount);

    if (amountAsNumber > 0.01) {
        const formattedValue = amount.toString();
        const index = formattedValue.indexOf(".");

        if (index !== -1 && formattedValue.length - index > 2) {
            return formattedValue.slice(0, index + 3);
        }
        return formattedValue;
    }

    const formattedValue = amount.toLocaleString();

    return formattedValue
        .replace(/(\.\d*?[1-9])0+$/, "$1")
        .replace(/\.$/, "")
        .slice(0, 8);
}
