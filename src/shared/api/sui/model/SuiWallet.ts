import { CoinMetadata } from "@mysten/sui/dist/cjs/client";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG, SUI_DECIMALS } from "@mysten/sui/utils";
import { EthersError } from "ethers";
import { cryptographyController } from "@/shared/lib";
import {
    APIResponseFail,
    APIResponseNormal,
    CHAINS,
    PromisedAPIResponse,
    TokenBalance
} from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { coingeckoClient } from "../../coingecko";
import { CoinIds, CoinPrice } from "../../coingecko/lib/types";
import { getCoinType } from "../lib/helpers/getCoinType";
import { parseSuiTxn } from "../lib/helpers/parseSuiTxn";
import { suiClient } from "../lib/providers/suiClient";

type TxAPIResponse = PromisedAPIResponse<BaseTxnParsed | null>;
type TxAPIResponseFail = APIResponseFail;
type TxAPIResponseNormal = APIResponseNormal<BaseTxnParsed | null>;

export class SuiWallet {
    readonly _address: string;
    constructor(address: string) {
        this._address = address;
    }

    async getNativeTokenBalance(): PromisedAPIResponse<number> {
        try {
            const balance = await suiClient.getBalance({
                owner: this._address,
                coinType: SUI_TYPE_ARG
            });
            return { data: +balance.totalBalance / SUI_DECIMALS, isError: false };
        } catch (error) {
            console.error(error);
            return { data: 0, isError: true, errorMessage: (error as Error).message };
        }
    }

    async getAllCoinBalances(): PromisedAPIResponse<TokenBalance[]> {
        try {
            const balances = await suiClient.getAllBalances({
                owner: this._address
            });
            const metadataArr = await Promise.all(
                balances.map(async ({ coinType }) => ({
                    coinType,
                    metadata: await suiClient.getCoinMetadata({
                        coinType
                    }),
                    price:
                        coinType === SUI_TYPE_ARG
                            ? await coingeckoClient.getCoinPriceByCoinID(CoinIds.SUI)
                            : await coingeckoClient.getCoinPriceByContract(CHAINS.SUI, coinType)
                }))
            );
            const coinsMetadata: Record<
                string,
                (CoinMetadata & CoinPrice) | null
            > = metadataArr.reduce(
                (acc, curr) => ({
                    ...acc,
                    [curr.coinType]: curr.metadata
                        ? { ...(curr.metadata ?? {}), ...curr.price }
                        : null
                }),
                {}
            );

            const parsed = balances.map<TokenBalance>(coinBalance => {
                const metadata = coinsMetadata[coinBalance.coinType];
                const balance = +coinBalance.totalBalance / 10 ** (metadata?.decimals ?? 9);
                const isSui = coinBalance.coinType === SUI_TYPE_ARG;
                const res: TokenBalance = {
                    balance,
                    balanceUSD: balance * (metadata?.price ?? 0),
                    tokenID: metadata?.name ?? getCoinType(metadata?.name),
                    tokenName: metadata?.name ?? getCoinType(metadata?.name),
                    tokenSymbol: metadata?.symbol ?? metadata?.name ?? getCoinType(metadata?.name),
                    tokenIcon: isSui
                        ? "https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290"
                        : metadata?.iconUrl || undefined,
                    tokenContract: coinBalance.coinType ?? "",
                    price: metadata?.price ?? 0,
                    change24h: metadata?.change24h ?? 0,
                    platform: CHAINS.SUI,
                    isNativeToken: isSui
                };
                return res;
            });
            return { data: parsed, isError: false };
        } catch (error) {
            console.error(error);
            return { data: [], isError: true, errorMessage: (error as Error).message };
        }
    }

    async _signAndSendTransaction(tx: Transaction, mnemonic: string): TxAPIResponse {
        try {
            const keypair = await cryptographyController.suiKeypairFromMnemonic(mnemonic);
            const result = await suiClient.signAndExecuteTransaction({
                signer: keypair,
                transaction: tx
            });

            const executedTransaction = await suiClient.waitForTransaction({
                digest: result.digest,
                options: {
                    showEffects: true,
                    showBalanceChanges: true
                }
            });

            return {
                data: await parseSuiTxn(executedTransaction, this._address),
                isError: false
            } as TxAPIResponseNormal;
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message
            } as TxAPIResponseFail;
        }
    }

    async transferTokenByContractAddress(
        to: string,
        amount: number,
        tokenContractAddress: string,
        mnemonic: string,
    ): TxAPIResponse {
        try {
            const tx = new Transaction();
            const { data: coins } = await suiClient.getCoins({
                owner: this._address,
                coinType: tokenContractAddress
            });
            const metadata = await suiClient.getCoinMetadata({ coinType: tokenContractAddress });
            const amountInSmallestUnit = BigInt(amount * 10 ** (metadata?.decimals ?? 9));
            const [coin] = tx.splitCoins(coins[0].coinObjectId, [
                tx.pure.u64(amountInSmallestUnit)
            ]);
            tx.transferObjects([coin], tx.pure.address(to));

            if (!tx) throw new Error("Error while creating transaction");

            return await this._signAndSendTransaction(tx, mnemonic);
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message
            } as TxAPIResponseFail;
        }
    }

    async transferNativeToken(to: string, amount: number, mnemonic: string): TxAPIResponse {
        try {
            const tx = new Transaction();
            const suiAmount = Math.floor(amount * 10 ** SUI_DECIMALS);
            const [coin] = tx.splitCoins(tx.gas, [suiAmount]);
            // transfer the split coin to a specific address
            tx.transferObjects([coin], to);

            if (!tx) throw new Error("Error while creating transaction");

            return await this._signAndSendTransaction(tx, mnemonic);
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message
            } as TxAPIResponseFail;
        }
    }
}
