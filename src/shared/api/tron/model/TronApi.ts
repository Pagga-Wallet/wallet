import { ethers } from "ethers";
import { BigNumber } from "tronweb";
import { coingeckoClient } from "@/shared/api/coingecko";
import { TRC20ABI } from "@/shared/lib/consts/tron";
import { getTokenIconUrl } from "@/shared/lib/helpers/getTokenIconUrl";
import { CHAINS, PromisedAPIResponse, TokenBalance } from "@/shared/lib/types";
import { trongridInstance, tronwebProvider } from "../lib/providers";
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

export class TronAPI {
    public readonly _address: string;
    public readonly _chain: CHAINS = CHAINS.TRON;
    constructor(address: string) {
        this._address = address;
    }

    async _getTokenDataFromContract({
        tokenContractAddress,
    }: GetTokenBalanceByContractAddressDTO): PromisedAPIResponse<TokenBalanceByContractAddressResponse | null> {
        try {
            const contract = tronwebProvider.contract(TRC20ABI, tokenContractAddress);

            const balance: BigNumber = await contract
                .balanceOf(this._address)
                .call({ from: this._address });
            const decimals = await contract.decimals().call({ from: this._address });
            const symbol = await contract.symbol().call({ from: this._address });
            const name = await contract.name().call({ from: this._address });

            const parsedBalance = parseFloat(ethers.formatUnits(balance.toString(), decimals));
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
        sort = "desc",
    }: GetNormalTransactionsDTO): PromisedAPIResponse<NormalTransactionsResponse> {
        try {
            const response = await trongridInstance.get(`/accounts/${address}/transactions`, {
                params: {
                    search_internal: false,
                    only_confirmed: true,
                    limit: 200,
                    order_by: "block_timestamp," + sort,
                },
            });
            return { data: response.data?.data ?? [], isError: !response.data?.success };
        } catch (error) {
            console.error(error);
            return { data: [], isError: true, errorMessage: (error as Error).message };
        }
    }

    async getTokenTransactions({
        address = this._address,
        contractaddress,
        sort = "desc",
    }: GetTokenTransactionsDTO): PromisedAPIResponse<TokenTransactionsResponse> {
        try {
            const response = await trongridInstance.get(`/accounts/${address}/transactions/trc20`, {
                params: {
                    only_confirmed: true,
                    limit: 200,
                    order_by: "block_timestamp," + sort,
                    contract_address: contractaddress,
                },
            });
            return { data: response.data?.data ?? [], isError: !response.data?.success };
        } catch (error) {
            console.error(error);
            return { data: [], isError: true, errorMessage: (error as Error).message };
        }
    }
}
