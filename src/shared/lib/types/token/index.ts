import { CHAINS } from "../multichainAccount";

export type TokenPriceHistory = Array<[number, number]>;
export interface TokenDetailQueryObj {
    isNativeToken: boolean;
    platform: CHAINS;
    tokenContract?: string;
}
