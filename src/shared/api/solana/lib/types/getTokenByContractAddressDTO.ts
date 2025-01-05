export interface GetTokenByContractAddressDTO {
    contractaddress: string;
}

export type TokenByContractAddressResponse = {
    contractAddress: string;
    tokenName: string;
    symbol: string;
    divisor: string;
    tokenType: string;
    totalSupply: string;
    blueCheckmark: string;
    description: string;
    website: string;
    email: string;
    blog: string;
    reddit: string;
    slack: string;
    facebook: string;
    twitter: string;
    bitcointalk: string;
    github: string;
    telegram: string;
    wechat: string;
    linkedin: string;
    discord: string;
    whitepaper: string;
    tokenPriceUSD: string;
};
