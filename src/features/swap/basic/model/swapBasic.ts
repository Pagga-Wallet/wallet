import { Address } from "@ton/core";
import { MultichainAccount } from "@/entities/multichainAccount";
import { getEVMWalletByChain } from "@/shared/api/evm";
import { CHAINS, isEVMChain, PromisedAPIResponse, TokenBalance } from "@/shared/lib/types";
import { coffeeSwap } from "../../coffeeswap";
import { OneInchSwap } from "../../oneInch";

export interface SwapInfo {
    inputAmount: number;
    outputAmount: number;
    priceImpact?: number;
    gas: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paths?: any[];
}

export interface SwapConfigurationDTO {
    inputToken: TokenBalance;
    outputToken: TokenBalance;
    amount: number;
    inputAmount?: boolean;
}

export interface ExecuteSwapParamsTON {
    mnemonics: string;
    slippage: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paths: any[];
    inputAmount?: boolean;
    multichainAccount: MultichainAccount;
}

export interface ExecuteSwapParamsEVM {
    mnemonics: string;
    inputToken: TokenBalance;
    outputToken: TokenBalance;
    amount: number;
    slippage: number;
    multichainAccount: MultichainAccount;
}

export type ExecuteSwapParams<T extends CHAINS> = T extends CHAINS.TON
    ? ExecuteSwapParamsTON
    : ExecuteSwapParamsEVM;

/**
 * Универсальный контроллер для взаимодействия с разными провайдерами свапов
 */
export class SwapBasic {
    public readonly chain: CHAINS;
    public readonly oneInchApi: OneInchSwap | null = null;

    constructor(chain: CHAINS) {
        this.chain = chain;
        if (isEVMChain(chain)) this.oneInchApi = new OneInchSwap(chain);
    }

    async getAssetsList(): PromisedAPIResponse<TokenBalance[] | null> {
        try {
            let data: TokenBalance[] | null;
            if (this.chain === CHAINS.TON) {
                data = (await coffeeSwap.getAssetsList()).data;
            } else if (isEVMChain(this.chain)) {
                data = (await this.oneInchApi!.getAssetsList()).data;
            } else {
                throw new Error("Invalid chain");
            }
            if (!data) return { data: null, isError: true };
            return { data: data, isError: false };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }

    async getSwapConfiguration({
        inputToken,
        outputToken,
        amount,
        inputAmount = true,
    }: SwapConfigurationDTO): PromisedAPIResponse<SwapInfo | null> {
        try {
            let data: SwapInfo | null = null;

            if (this.chain === CHAINS.TON) {
                // Coffee Swap
                const res = await coffeeSwap.getRoute({
                    inputToken: inputToken.isNativeToken
                        ? "native"
                        : Address.parse(inputToken.tokenContract!),
                    outputToken: outputToken.isNativeToken
                        ? "native"
                        : Address.parse(outputToken.tokenContract!),
                    amount,
                    inputAmount,
                });

                if (res?.isError || !res.data)
                    return { isError: true, errorMessage: res.errorMessage, data: null };

                data = {
                    inputAmount: res.data.input_amount,
                    outputAmount: res.data.output_amount,
                    priceImpact: res.data.price_impact,
                    gas: res.data.recommended_gas,
                    paths: res.data.paths,
                };
            } else if (isEVMChain(this.chain)) {
                // 1inch Swap
                const res = await this.oneInchApi!.getQuote({ inputToken, outputToken, amount });

                if (res.isError || !res.data)
                    return { isError: true, errorMessage: res.errorMessage, data: null };

                data = {
                    inputAmount: res.data.srcAmount,
                    outputAmount: res.data.dstAmount,
                    gas: res.data.gas,
                };
            } else {
                throw new Error("Invalid chain");
            }

            if (!data) return { data: null, isError: true };
            return { data: data, isError: false };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }

    async executeSwap<T extends CHAINS>(
        params: ExecuteSwapParams<T>
    ): PromisedAPIResponse<boolean> {
        try {
            let result = false;

            if (this.chain === CHAINS.TON) {
                const tonParams = params as ExecuteSwapParamsTON;

                const boc = await coffeeSwap.buildBOC({
                    addressUser: Address.parse(
                        tonParams.multichainAccount.getAddressInNetwork(CHAINS.TON)
                    ),
                    paths: tonParams.paths,
                });
                if (!boc.data?.transactions) throw new Error("Invalid BOC");
                // Send
                result = await tonParams.multichainAccount._tonWallet.sendRawTrx(
                    tonParams.mnemonics,
                    undefined,
                    boc.data.transactions.map((tx) => ({
                        amount: tx.value,
                        address: tx.address,
                        payload: tx.cell,
                    }))
                );
            } else if (isEVMChain(this.chain)) {
                const evmParams = params as ExecuteSwapParamsEVM;

                const { data } = await this.oneInchApi!.buildSwap({
                    inputToken: evmParams.inputToken,
                    outputToken: evmParams.outputToken,
                    amount: evmParams.amount,
                    from: evmParams.multichainAccount.getAddressInNetwork(this.chain),
                });

                const wallet = getEVMWalletByChain(
                    evmParams.multichainAccount.getAddressInNetwork(this.chain),
                    this.chain
                );

                if (!data || !data.tx) throw new Error("Fail to build tx");
                const res = await wallet._signAndSendTransaction(data.tx, evmParams.mnemonics);

                result = !res.isError;
            } else {
                throw new Error("Invalid chain");
            }

            if (!result) return { data: false, isError: true };
            return { data: true, isError: false };
        } catch (error) {
            console.error(error);
            return { data: false, isError: true };
        }
    }
}
