import { EthersError, ethers } from "ethers";
import { cryptographyController } from "@/shared/lib";
import { ERC20ABI, ERC721ABI } from "@/shared/lib/consts/ethereum";
import {
    APIResponseFail,
    APIResponseNormal,
    CHAINS,
    PromisedAPIResponse,
} from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { parseEVMRawTxn } from "../lib/helpers/parseEVMTxn";

type CreateEVMTxResponse = Promise<ethers.Transaction | null>;
type TxAPIResponse = PromisedAPIResponse<BaseTxnParsed | null>;
type TxAPIResponseFail = APIResponseFail;
type TxAPIResponseNormal = APIResponseNormal<BaseTxnParsed | null>;

export class EVMBasicAPI {
    readonly _address: string;
    readonly _provider: ethers.JsonRpcProvider;
    readonly _chain: CHAINS;
    constructor(address: string, _provider: ethers.JsonRpcProvider, _chain: CHAINS) {
        this._address = address;
        this._provider = _provider;
        this._chain = _chain;
    }

    async getLatestBlockNumber(): PromisedAPIResponse<number> {
        try {
            const data = await this._provider.getBlockNumber();
            return { data: data, isError: false };
        } catch (error) {
            console.error(error);
            return { data: -1, isError: true, errorMessage: (error as Error).message };
        }
    }

    async getNativeTokenBalance(): PromisedAPIResponse<number> {
        try {
            const balance = await this._provider.getBalance(this._address);
            return { data: parseFloat(ethers.formatEther(balance)), isError: true };
        } catch (error) {
            console.error(error);
            return { data: 0, isError: true, errorMessage: (error as Error).message };
        }
    }

    async _signAndSendTransaction(tx: ethers.Transaction, mnemonic: string): TxAPIResponse {
        try {
            const HDwallet = await cryptographyController.ethereumHDWalletFromUnknownMnemonic(
                mnemonic
            );
            const wallet = new ethers.Wallet(HDwallet.privateKey, this._provider);
            await wallet.signTransaction(tx);
            const sentTx = await wallet.sendTransaction(tx);
            const processedTx = await sentTx.wait();
            console.log("processedTx", processedTx);
            return {
                data: !processedTx
                    ? null
                    : parseEVMRawTxn(processedTx, tx, this._address, this._chain),
                isError: processedTx?.status === 0,
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

    async getTxEstimatedGas(to: string, amount: number, data?: string): Promise<bigint | null> {
        try {
            const txAmount = ethers.parseEther(amount.toString());
            const { chainId } = await this._provider.getNetwork();

            const gasLimit = await this._provider.estimateGas({
                from: this._address,
                to: to,
                value: txAmount,
                chainId: chainId,
                data: data,
            });

            return gasLimit;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async _createTransaction(to: string, amount: number, data?: string): CreateEVMTxResponse {
        try {
            const txAmount = ethers.parseEther(amount.toString());
            const { chainId } = await this._provider.getNetwork();
            const txCount = await this._provider.getTransactionCount(this._address);
            const gasLimit = await this.getTxEstimatedGas(to, amount, data);
            if (gasLimit === null) return null;

            const tx = new ethers.Transaction();
            tx.to = to;
            tx.value = txAmount;
            tx.gasLimit = gasLimit;
            tx.chainId = chainId;
            tx.nonce = txCount;
            if (data) tx.data = data;
            return tx;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async _createTransferTokenByContractTransaction(
        to: string,
        amount: number,
        tokenContractAddress: string,
        memo?: string
    ): CreateEVMTxResponse {
        try {
            const contract = new ethers.Contract(tokenContractAddress, ERC20ABI, this._provider);
            const decimals = await contract.decimals();
            const scaledAmount = ethers.parseUnits(amount.toString(), decimals);

            const data = contract.interface.encodeFunctionData("transferFrom", [
                this._address,
                to,
                scaledAmount,
            ]);

            const rawTx = await this._createTransaction(
                to,
                amount,
                data + (memo ? ethers.hexlify(ethers.toUtf8Bytes(memo)).slice(2) : "")
            );
            return rawTx;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async _createTransferNFTTransaction(
        to: string,
        nftID: string,
        contractAddress: string
    ): CreateEVMTxResponse {
        try {
            const contract = new ethers.Contract(contractAddress, ERC721ABI, this._provider);
            const data = contract.interface.encodeFunctionData("transferFrom", [
                this._address,
                to,
                nftID,
            ]);
            const rawTx = await this._createTransaction(to, 0, data);
            return rawTx;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async transferNFT(
        to: string,
        nftID: string,
        contractAddress: string,
        mnemonic: string
    ): TxAPIResponse {
        try {
            const rawTx = await this._createTransferNFTTransaction(to, nftID, contractAddress);
            if (!rawTx) throw new Error("Error while creating transaction");
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
            const rawTx = await this._createTransaction(
                to,
                amount,
                memo && ethers.hexlify(ethers.toUtf8Bytes(memo))
            );
            if (!rawTx) throw new Error("Error while creating transaction");
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

    //  async getNFTMetadata(contractAddress: string, nftID: string): Promise<string | null> {
    //     try {
    //         const contract = new ethers.Contract(contractAddress, ERC721ABI, this._provider);
    //         const tokenMetadataURI: string = await contract["tokenURI"]?.(nftID);
    //         const tokenMetadata = (await axios.get(convertIpfsUriToHttp(tokenMetadataURI))).data;
    //         tokenMetadata.image = convertIpfsUriToHttp(tokenMetadata.image);
    //         console.log(tokenMetadata);
    //         return tokenMetadata;
    //     } catch (error) {
    //         console.error(error);
    //         return null;
    //     }
    // }
}
