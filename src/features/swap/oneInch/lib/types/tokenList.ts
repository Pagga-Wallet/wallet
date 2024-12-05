export interface Token {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
    logoURI: string | null;
    eip2612: boolean;
    tags: string[];
}

export type Tokens = {
    tokens: Record<string, Token>;
};
