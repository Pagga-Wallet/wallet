import { IPaginationWithPageParams } from "./paginationParams";

export interface GetOwnedERC721TokensDTO extends IPaginationWithPageParams {
    address?: string;
}

export type OwnedERC721TokensResponse = Array<{
    TokenAddress: string;
    TokenName: string;
    TokenSymbol: string;
    TokenQuantity: string;
}>;
