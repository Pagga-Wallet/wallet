import { IPaginationWithPageParams } from "./paginationParams";

export interface GetOwnedERC20TokensDTO extends IPaginationWithPageParams {
    address?: string;
}

export type OwnedERC20TokensResponse = Array<{
    TokenAddress: string;
    TokenName: string;
    TokenSymbol: string;
    TokenQuantity: string;
    TokenDivisor: string;
}>;
