interface ImagePreview {
    resolution: string;
    url: string;
}

export interface GetNFT_DTO {
    address: string;
    collection: {
        address: string;
        description: string;
        name: string;
    };
    metadata: {
        name: string;
        description: string;
    };
    owner: {
        address: string;
        is_scam: boolean;
        is_wallet: boolean;
    };
    verified: boolean;
    previews?: ImagePreview[];
}
