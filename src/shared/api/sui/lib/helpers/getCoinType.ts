export const getCoinType = (text: string | undefined): string => {
    if (!text) return "";
    const arr = text.split("::");
    return arr[arr.length - 1].replace(">", "");
};
