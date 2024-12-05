interface AccountAddress {
    address: string;
    name?: string;
    is_scam: boolean;
    icon?: string;
    is_wallet: boolean;
}

interface NftItem {
    address: string;
    index: bigint;
    owner?: AccountAddress;
    collection?: {
        address: string;
        name: string;
        description: string;
    };
    verified: boolean;
    metadata: {
        name: string;
    };
    sale?: Sale;
    previews?: ImagePreview[];
    dns?: string;
    approved_by: NftApprovedBy;
}

interface Sale {
    address: string;
    market: AccountAddress;
    owner?: AccountAddress;
    price: Price;
}

interface Price {
    value: string;
    token_name: string;
}

interface ImagePreview {
    resolution: string;
    url: string;
}

type NftApprovedBy = ["getgems" | "tonkeeper" | "ton.diamonds"];

export interface GetAllNFTsDTO {
    nft_items: NftItem[];
}
