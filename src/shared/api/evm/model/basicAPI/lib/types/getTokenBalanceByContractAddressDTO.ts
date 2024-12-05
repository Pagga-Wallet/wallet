import { Addressable } from "ethers";

export interface GetTokenBalanceByContractAddressDTO {
    tokenContractAddress: Addressable | string;
}

export interface TokenBalanceByContractAddressResponse {
    balance: number;
    decimals: number;
    symbol: string;
    name: string;
}
