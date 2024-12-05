interface JettonBalance {
    balance: string;
    jetton: {
        address: string;
        decimals: number;
        image: undefined | string;
        name: string;
        symbol: string;
        verification: any;
    };
    verification: any;
    wallet_address: AccountSmall;
    price: {
        prices: { [key: string]: number };
        diff_24h: {
            USD: string;
        };
    };
    lock?: {
        amount: string;
        till: number;
    };
}

interface AccountSmall {
    address: string;
    icon: undefined | string;
    is_scam: boolean;
    name: undefined | string;
}

export interface GetAllJettonsBalancesDTO {
    balances: JettonBalance[];
}
