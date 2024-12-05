import { AxiosInstance } from "axios";
import { ethers } from "ethers";
import { coingeckoClient } from "@/shared/api/coingecko";
import { ERC20ABI } from "@/shared/lib/consts/ethereum";
import { getTokenIconUrl } from "@/shared/lib/helpers/getTokenIconUrl";
import { CHAINS, PromisedAPIResponse, TokenBalance } from "@/shared/lib/types";
import {
    GetNormalTransactionsDTO,
    NormalTransactionsResponse,
} from "../lib/types/getNormalTransactionsDTO";
import {
    GetTokenBalanceByContractAddressDTO,
    TokenBalanceByContractAddressResponse,
} from "../lib/types/getTokenBalanceByContractAddressDTO";
import { GetTokenByContractAddressDTO } from "../lib/types/getTokenByContractAddressDTO";
import {
    GetTokenTransactionsDTO,
    TokenTransactionsResponse,
} from "../lib/types/getTokenTransactionsDTO";

export class BasicOffchainAPI {
    public readonly _address: string;
    public readonly _rpcProvider: ethers.JsonRpcProvider;
    public readonly _offchainProvider: AxiosInstance;
    public readonly _chain: CHAINS;
    constructor(
        address: string,
        _rpcProvider: ethers.JsonRpcProvider,
        _offchainProvider: AxiosInstance,
        _chain: CHAINS
    ) {
        this._address = address;
        this._rpcProvider = _rpcProvider;
        this._offchainProvider = _offchainProvider;
        this._chain = _chain;
    }

    async _getTokenDataFromContract({
        tokenContractAddress,
    }: GetTokenBalanceByContractAddressDTO): PromisedAPIResponse<TokenBalanceByContractAddressResponse | null> {
        try {
            const contract = new ethers.Contract(tokenContractAddress, ERC20ABI, this._rpcProvider);

            const balance = await contract.getFunction("balanceOf").staticCall(this._address);
            const decimals = await contract.getFunction("decimals").staticCall();
            const symbol = await contract.getFunction("symbol").staticCall();
            const name = await contract.getFunction("name").staticCall();

            const parsedBalance = parseFloat(ethers.formatUnits(balance, decimals));
            return {
                data: { balance: parsedBalance, decimals: Number(decimals), symbol, name },
                isError: false,
            };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true, errorMessage: (error as Error).message };
        }
    }

    async getTokenByContractAddress({
        contractaddress,
    }: GetTokenByContractAddressDTO): PromisedAPIResponse<TokenBalance | null> {
        try {
            const { data } = await this._getTokenDataFromContract({
                tokenContractAddress: contractaddress,
            });
            if (!data)
                throw new Error("Error while fetching token. Check token's contract address");
            const geckoData = await coingeckoClient.getCoinPriceByContract(
                this._chain,
                contractaddress
            );
            const iconUrl = getTokenIconUrl(this._chain, contractaddress);
            const tokenData: TokenBalance = {
                tokenContract: contractaddress,
                tokenID: data.name,
                tokenName: data.name,
                tokenSymbol: data.symbol,
                tokenIcon: iconUrl,
                platform: this._chain,
                decimals: data.decimals,
                isNativeToken: false,
                balance: data.balance ?? 0,
                change24h: geckoData.change24h,
                balanceUSD: geckoData.price * (data.balance ?? 0),
                price: geckoData.price,
            };
            return { data: tokenData, isError: false };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true, errorMessage: (error as Error).message };
        }
    }

    async getNormalTransactions({
        address = this._address,
        page = 0,
        offset = 20,
        sort = "desc",
        startblock = 0,
        endblock = 99999999,
    }: GetNormalTransactionsDTO): PromisedAPIResponse<NormalTransactionsResponse> {
        try {
            const data = await this._offchainProvider.get("/", {
                params: {
                    module: "account",
                    action: "txlist",
                    startblock,
                    endblock,
                    address,
                    page,
                    offset,
                    sort,
                },
            });
            return { data: data.data?.result ?? [], isError: !(data.data?.status === "1") };
        } catch (error) {
            console.error(error);
            return { data: [], isError: true, errorMessage: (error as Error).message };
        }
    }

    async getTokenTransactions({
        address = this._address,
        contractaddress,
        page = 0,
        offset = 20,
        sort = "desc",
        startblock = 0,
        endblock = 99999999,
    }: GetTokenTransactionsDTO): PromisedAPIResponse<TokenTransactionsResponse> {
        try {
            const data = await this._offchainProvider.get("/", {
                params: {
                    module: "account",
                    action: "tokentx",
                    contractaddress,
                    startblock,
                    endblock,
                    address,
                    page,
                    offset,
                    sort,
                },
            });
            return { data: data.data?.result ?? [], isError: !(data.data?.status === "1") };
        } catch (error) {
            console.error(error);
            return { data: [], isError: true, errorMessage: (error as Error).message };
        }
    }

    // async getNFTTransactions({
    //     address = this._address,
    //     contractaddress,
    //     page = 0,
    //     offset = 20,
    //     sort = "desc",
    //     startblock = 0,
    //     endblock = 99999999
    // }: GetNFTTransactionsDTO): PromisedAPIResponse<NFTTransactionsResponse> {
    //     try {
    //         const data = await this._offchainProvider.get("/", {
    //             params: {
    //                 module: "account",
    //                 action: "tokennfttx",
    //                 contractaddress,
    //                 startblock,
    //                 endblock,
    //                 address,
    //                 page,
    //                 offset,
    //                 sort
    //             }
    //         });
    //         return { data: data.data?.result ?? [], isError: !(data.data?.status === "1") };
    //     } catch (error) {
    //         console.error(error);
    //         return { data: [], isError: true };
    //     }
    // }

    // async getOwnedERC20Tokens({
    //     address = this._address,
    //     page = 0,
    //     offset = 1500
    // }: GetOwnedERC20TokensDTO): PromisedAPIResponse<OwnedERC20TokensResponse> {
    //     try {
    //         const data = await this._offchainProvider.get("/", {
    //             params: {
    //                 module: "account",
    //                 action: "addresstokenbalance",
    //                 address,
    //                 page,
    //                 offset
    //             }
    //         });
    //         const isError = !(data.data?.status === "1");
    //         return {
    //             data: isError ? [] : data.data?.result,
    //             isError,
    //             errorMessage: isError ? data.data?.result : undefined
    //         };
    //     } catch (error) {
    //         console.error(error);
    //         return { data: [], isError: true, errorMessage: (error as Error).message };
    //     }
    // }

    // async getOwnedERC721Tokens({
    //     address = this._address,
    //     page = 0,
    //     offset = 1000
    // }: GetOwnedERC721TokensDTO): PromisedAPIResponse<OwnedERC721TokensResponse> {
    //     try {
    //         // 0x6b52e83941eb10f9c613c395a834457559a80114
    //         const data = await this._offchainProvider.get("/", {
    //             params: {
    //                 module: "account",
    //                 action: "addresstokennftbalance",
    //                 address,
    //                 page,
    //                 offset
    //             }
    //         });
    //         const isError = !(data.data?.status === "1");
    //         return {
    //             data: isError ? [] : data.data?.result,
    //             isError,
    //             errorMessage: isError ? data.data?.result : undefined
    //         };
    //     } catch (error) {
    //         console.error(error);
    //         return { data: [], isError: true, errorMessage: (error as Error).message };
    //     }
    // }

    // async getOwnedNFTsByContractAddress({
    //     address = this._address,
    //     contractaddress,
    //     page = 0,
    //     offset = 1000
    // }: GetOwnedNFTsByContractAddressDTO): PromisedAPIResponse<
    //     OwnedNFTsByContractAddressResponse
    // > {
    //     try {
    //         // 0x6b52e83941eb10f9c613c395a834457559a80114
    //         const data = await this._offchainProvider.get("/", {
    //             params: {
    //                 module: "account",
    //                 action: "addresstokennftinventory",
    //                 contractaddress,
    //                 address,
    //                 page,
    //                 offset
    //             }
    //         });
    //         const isError = !(data.data?.status === "1");
    //         return {
    //             data: isError ? [] : data.data?.result,
    //             isError,
    //             errorMessage: isError ? data.data?.result : undefined
    //         };
    //     } catch (error) {
    //         console.error(error);
    //         return { data: [], isError: true, errorMessage: (error as Error).message };
    //     }
    // }
}
