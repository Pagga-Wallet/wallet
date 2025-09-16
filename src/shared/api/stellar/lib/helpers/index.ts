import { StrKey } from "@stellar/stellar-sdk";

/**
 * Checks if a string is a valid Stellar address
 */
export const isValidStellarAddress = (address: string): boolean => {
    try {
        return StrKey.isValidEd25519PublicKey(address);
    } catch {
        return false;
    }
};

/**
 * Formats Stellar (XLM) amount for display
 */
export const formatStellarAmount = (amount: number, decimals: number = 7): string => {
    return amount.toFixed(decimals);
};

/**
 * Converts stroops to XLM
 */
export const stroopsToXlm = (stroops: string | number): number => {
    return Number(stroops) / 10000000;
};

/**
 * Converts XLM to stroops
 */
export const xlmToStroops = (xlm: string | number): string => {
    return (Number(xlm) * 10000000).toString();
};
