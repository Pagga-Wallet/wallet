import {
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL,
    SystemProgram,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import { EthersError } from "ethers";
import { cryptographyController } from "@/shared/lib";
import { APIResponseFail, APIResponseNormal, PromisedAPIResponse } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { solanaRPC } from "../../solana/lib/providers/solanaRPC";
import { parseSolanaSignedTxn } from "../lib/helpers/parseSolanaSignedTxn";

type CreateTxResponse = Promise<Transaction | null>;
type TxAPIResponse = PromisedAPIResponse<BaseTxnParsed | null>;
type TxAPIResponseFail = APIResponseFail;
type TxAPIResponseNormal = APIResponseNormal<BaseTxnParsed | null>;

export class SolanaWallet {
    readonly _address: string;
    readonly _publicKey: PublicKey;
    constructor(address: string) {
        this._address = address;
        this._publicKey = new PublicKey(this._address);
    }

    async getNativeTokenBalance(): PromisedAPIResponse<number> {
        try {
            const balanceLamports = await solanaRPC.getBalance(this._publicKey);
            return { data: balanceLamports / LAMPORTS_PER_SOL, isError: false };
        } catch (error) {
            console.error(error);
            return { data: 0, isError: true, errorMessage: (error as Error).message };
        }
    }

    async _signAndSendTransaction(tx: Transaction, mnemonic: string): TxAPIResponse {
        try {
            const keypair = await cryptographyController.solanaKeypairFromMnemonic(mnemonic);
            const signature = await sendAndConfirmTransaction(solanaRPC, tx, [keypair]);

            if (!signature) throw new Error("Tx Failed");

            const res = await solanaRPC.getParsedTransaction(signature)
            const lamports = Number((res?.transaction.message.instructions[0] as any)?.parsed?.info?.lamports) || 0
            const to = (res?.transaction.message.instructions[0] as any)?.parsed?.info?.destination
            return {
                data: parseSolanaSignedTxn(tx, this._address, signature, to, lamports),
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

    // async _createTransferTokenByContractTransaction(
    //     to: string,
    //     amount: number,
    //     tokenContractAddress: string
    // ): CreateTxResponse {
    //     try {
    //         const contract = await tronwebProvider.contract().at(tokenContractAddress);
    //         const decimals = await contract.decimals().call();
    //         const scaledAmount = tronwebProvider
    //             .toBigNumber(amount)
    //             .times(tronwebProvider.toBigNumber(10).pow(decimals));

    //         const functionSelector = "transfer(address,uint256)";
    //         const parameter = [
    //             { type: "address", value: to },
    //             { type: "uint256", value: scaledAmount.toFixed(0) },
    //         ];
    //         const tx = await tronwebProvider.transactionBuilder.triggerSmartContract(
    //             tokenContractAddress,
    //             functionSelector,
    //             {},
    //             parameter,
    //             this._address
    //         );
    //         return tx.transaction;
    //     } catch (error) {
    //         console.error(error);
    //         return null;
    //     }
    // }

    // async transferTokenByContractAddress(
    //     to: string,
    //     amount: number,
    //     tokenContractAddress: string,
    //     mnemonic: string,
    //     memo?: string
    // ): TxAPIResponse {
    //     try {
    //         const rawTx = await this._createTransferTokenByContractTransaction(
    //             to,
    //             amount,
    //             tokenContractAddress
    //         );
    //         if (!rawTx) throw new Error("Error while creating transaction");
    //         if (memo) {
    //             rawTx.raw_data.data = TronWeb.toHex(memo);
    //         }
    //         return await this._signAndSendTransaction(rawTx, mnemonic);
    //     } catch (error) {
    //         console.error(error);
    //         return {
    //             data: null,
    //             isError: true,
    //             errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message,
    //         } as TxAPIResponseFail;
    //     }
    // }

    async transferNativeToken(to: string, amount: number, mnemonic: string): TxAPIResponse {
        try {
            const rawTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: this._publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: amount * LAMPORTS_PER_SOL
                })
            );
            if (!rawTx) throw new Error("Error while creating transaction");

            return await this._signAndSendTransaction(rawTx, mnemonic);
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
