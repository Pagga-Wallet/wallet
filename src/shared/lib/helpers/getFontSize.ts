export const getFontSize = (balance: string) => {
    const length = balance.length;
    if (length > 10) {
        return 35;
    } else {
        return 50 - (length - 1) * 1.5;
    }
};
