import { IPaginationWithPageParams } from "./paginationParams";

export interface GetOwnedNFTsByContractAddressDTO extends IPaginationWithPageParams {
    address?: string;
    contractaddress?: string;
}

export type OwnedNFTsByContractAddressResponse = Array<{
    TokenAddress: string;
    TokenId: string;
}>;
