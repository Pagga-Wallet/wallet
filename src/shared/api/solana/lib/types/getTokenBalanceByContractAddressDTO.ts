export interface GetTokenBalanceByContractAddressDTO {
    tokenContractAddress: string;
}

export interface TokenBalanceByContractAddressResponse {
    balance: number;
    decimals: number;
    symbol: string;
    name: string;
}
