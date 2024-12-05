export function scientificToDecimal(num: number): string {
    const str = num.toString();
    if (!/e/i.test(str)) {
        return num.toString();
    }

    const [coeff, exp] = str.split("e").map((item) => parseFloat(item));
    const decimals = Math.abs(parseInt(exp.toString(), 10));
    let result = coeff
        .toFixed(decimals)
        .replace(".", "")
        .padEnd(decimals + coeff.toFixed().length, "0");

    if (exp < 0) {
        result = "0." + "0".repeat(decimals - 1) + result.replace(/^(0)+/, "");
    }

    console.log(result);
    return result;
}
