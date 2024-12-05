export interface GetJettonDataByIdDTO {
    jettonAddress: string;
}

export interface JettonMetadataResponse {
    mintable: boolean;
    total_supply: string;
    admin: {
        address: string;
        name: string;
        is_scam: boolean;
        is_wallet: boolean;
    };
    metadata: {
        address: string;
        name: string;
        symbol: string;
        decimals: string;
        image: string;
        description: string;
    };
    verification: string;
    holders_count: number;
}

export interface JettonDataByIdResponse {}
