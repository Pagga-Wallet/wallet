import { AxiosInstance } from "axios";
import { ethers, Transaction } from "ethers";
import { EVM_CHAINS, PromisedAPIResponse, TokenBalance } from "@/shared/lib/types";
import { convertTokenList } from "../lib/helpers/convertTokenList";
import { getOneInchInstanse } from "../lib/providers";
import { Tokens } from "../lib/types/tokenList";

interface GetQuoteRequestDTO {
    inputToken: TokenBalance;
    outputToken: TokenBalance;
    amount: number;
}

interface GetQuoteResponseDTO {
    dstAmount: string;
    gas: number;
}

interface Quote {
    srcAmount: number;
    dstAmount: number;
    gas: number;
}

interface BuildSwapParams {
    inputToken: TokenBalance;
    outputToken: TokenBalance;
    amount: number;
    slippage?: number;
    from: string;
}

interface BuildSwapResult {
    dstAmount: number;
    tx: Transaction;
}

const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export class OneInchSwap {
    private readonly _instance: AxiosInstance;
    public readonly chain: EVM_CHAINS;

    constructor(chain: EVM_CHAINS) {
        this.chain = chain;
        this._instance = getOneInchInstanse(chain);
    }

    async getAssetsList(): PromisedAPIResponse<TokenBalance[] | null> {
        try {
            const { data } = await this._instance.get<Tokens>("/tokens");
            if (!data) return { data: null, isError: true };
            const parsedList = convertTokenList(data, this.chain);

            return { data: parsedList, isError: !data };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }

    async getQuote({
        inputToken,
        outputToken,
        amount,
    }: GetQuoteRequestDTO): PromisedAPIResponse<Quote | null> {
        try {
            if (
                (!inputToken.tokenContract && !inputToken.isNativeToken) ||
                (!outputToken.tokenContract && !outputToken.isNativeToken)
            )
                throw new Error("Invalid token");

            if (amount <= 0)
                return {
                    data: {
                        srcAmount: 0,
                        dstAmount: 0,
                        gas: 0,
                    },
                    isError: false,
                };

            const { data } = await this._instance.get<GetQuoteResponseDTO>("/quote", {
                params: {
                    src: inputToken.tokenContract ?? NATIVE_TOKEN_ADDRESS,
                    dst: outputToken.tokenContract ?? NATIVE_TOKEN_ADDRESS,
                    amount: ethers.parseUnits(amount.toString(), inputToken.decimals),
                    includeGas: true,
                },
            });
            if (!data) return { data: null, isError: true };
            const parsed = {
                srcAmount: amount,
                dstAmount: Number(ethers.formatUnits(data.dstAmount, inputToken.decimals)),
                gas: Number(ethers.formatEther(data.gas.toString())),
            };
            return { data: parsed, isError: !data };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }

    async buildSwap({
        inputToken,
        outputToken,
        amount,
        slippage = 5,
        from,
    }: BuildSwapParams): PromisedAPIResponse<BuildSwapResult | null> {
        try {
            if (
                (!inputToken.tokenContract && !inputToken.isNativeToken) ||
                (!outputToken.tokenContract && !outputToken.isNativeToken)
            )
                throw new Error("Invalid token");

            const { data } = await this._instance.get<BuildSwapResult>("/swap", {
                params: {
                    src: inputToken.tokenContract ?? NATIVE_TOKEN_ADDRESS,
                    dst: outputToken.tokenContract ?? NATIVE_TOKEN_ADDRESS,
                    amount: ethers.parseUnits(amount.toString(), inputToken.decimals),
                    slippage,
                    from,
                },
            });

            if (!data) return { data: null, isError: true };

            return { data: data, isError: !data };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }
}
