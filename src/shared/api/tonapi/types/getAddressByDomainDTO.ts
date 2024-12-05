export interface GetAddressByDomainDTO {
    wallet: {
        address: string;
        is_wallet: boolean;
        has_method_pubkey: boolean;
        has_method_seqno: boolean;
        names: string[];
    };
    next_resolver: string;
    sites: string[];
    storage: string;
}
