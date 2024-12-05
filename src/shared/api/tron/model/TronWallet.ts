import { EthersError } from "ethers";
import { TronWeb } from "tronweb";
import { SignedTransaction, Transaction } from "tronweb/lib/esm/types/Transaction";
import { cryptographyController } from "@/shared/lib";
import { APIResponseFail, APIResponseNormal, PromisedAPIResponse } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { parseTronSignedTxn } from "../lib/helpers/parseTronTxn";
import { tronwebProvider, tronwebProviderOptions } from "../lib/providers";

type CreateTxResponse = Promise<Transaction | null>;
type TxAPIResponse = PromisedAPIResponse<BaseTxnParsed | null>;
type TxAPIResponseFail = APIResponseFail;
type TxAPIResponseNormal = APIResponseNormal<BaseTxnParsed | null>;

export class TronWallet {
    readonly _address: string;
    constructor(address: string) {
        this._address = address;
    }

    async getLatestBlockID(): PromisedAPIResponse<string> {
        try {
            const data = await tronwebProvider.trx.getCurrentBlock();
            return { data: data.blockID, isError: false };
        } catch (error) {
            console.error(error);
            return { data: "", isError: true, errorMessage: (error as Error).message };
        }
    }

    async getNativeTokenBalance(): PromisedAPIResponse<number> {
        try {
            const balance = await tronwebProvider.trx.getBalance(this._address);
            return { data: Number(tronwebProvider.fromSun(balance)), isError: true };
        } catch (error) {
            console.error(error);
            return { data: 0, isError: true, errorMessage: (error as Error).message };
        }
    }

    async _signAndSendTransaction(tx: Transaction, mnemonic: string): TxAPIResponse {
        try {
            const { privateKey } = await cryptographyController.tronWalletFromUnknownMnemonic(
                mnemonic
            );
            const wallet = new TronWeb({
                ...tronwebProviderOptions,
                privateKey,
            });
            const signedTx = await wallet.trx.sign(tx);
            const result = await wallet.trx.sendRawTransaction(signedTx);

            return {
                data: parseTronSignedTxn(result.transaction, this._address),
                isError: result.code === 0,
            } as TxAPIResponseNormal;
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message,
            } as TxAPIResponseFail;
        }
    }

    async _createTransferTokenByContractTransaction(
        to: string,
        amount: number,
        tokenContractAddress: string
    ): CreateTxResponse {
        try {
            const contract = await tronwebProvider.contract().at(tokenContractAddress);
            const decimals = await contract.decimals().call();
            const scaledAmount = tronwebProvider
                .toBigNumber(amount)
                .times(tronwebProvider.toBigNumber(10).pow(decimals));

            const functionSelector = "transfer(address,uint256)";
            const parameter = [
                { type: "address", value: to },
                { type: "uint256", value: scaledAmount.toFixed(0) },
            ];
            const tx = await tronwebProvider.transactionBuilder.triggerSmartContract(
                tokenContractAddress,
                functionSelector,
                {},
                parameter,
                this._address
            );
            return tx.transaction;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async transferTokenByContractAddress(
        to: string,
        amount: number,
        tokenContractAddress: string,
        mnemonic: string,
        memo?: string
    ): TxAPIResponse {
        try {
            const rawTx = await this._createTransferTokenByContractTransaction(
                to,
                amount,
                tokenContractAddress
            );
            if (!rawTx) throw new Error("Error while creating transaction");
            if (memo) {
                rawTx.raw_data.data = TronWeb.toHex(memo);
            }
            return await this._signAndSendTransaction(rawTx, mnemonic);
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message,
            } as TxAPIResponseFail;
        }
    }

    async transferNativeToken(
        to: string,
        amount: number,
        mnemonic: string,
        memo?: string
    ): TxAPIResponse {
        try {
            const rawTx = await tronwebProvider.transactionBuilder.sendTrx(
                tronwebProvider.address.toHex(to),
                Number(tronwebProvider.toSun(amount)),
                tronwebProvider.address.toHex(this._address)
            );
            if (!rawTx) throw new Error("Error while creating transaction");
            if (memo) {
                rawTx.raw_data.data = TronWeb.toHex(memo);
            }
            return await this._signAndSendTransaction(rawTx, mnemonic);
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message,
            } as TxAPIResponseFail;
        }
    }
}
