import { getAddress, signTransaction } from "@stellar/freighter-api";
import {
    Keypair,
    Horizon,
    TransactionBuilder,
    Networks,
    Operation,
    Asset,
    Memo
} from "@stellar/stellar-sdk";
import { PromisedAPIResponse } from "@/shared/lib/types";

import { CHAINS } from "@/shared/lib/types/multichainAccount";
import { formatStellarAmount } from "../lib/helpers";
import {
    StellarSendResult,
    StellarTokenBalance,
    StellarTokenBalancesResult,
    StellarSendParams,
    StellarAssetSendParams
} from "../lib/types";

const STELLAR_CONFIG = {
    HORIZON_URL: "https://horizon.stellar.org",
    NETWORK_PASSPHRASE: Networks.PUBLIC
};

const STELLAR_CONSTANTS = {
    NATIVE_ASSET_CODE: "XLM",
    NATIVE_ASSET_NAME: "Stellar Lumens",
    DECIMALS: 7,
    MIN_BALANCE: 1,
    BASE_FEE: 100,
    DERIVATION_PATH: "m/44'/148'/0'"
};

export class StellarWallet {
    readonly _address: string;
    private _server: Horizon.Server;

    constructor(address: string) {
        this._address = address;
        this._server = new Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
    }

    async getNativeTokenBalance(): PromisedAPIResponse<number> {
        try {
            const account = await this._server.loadAccount(this._address);
            const xlmBalance = account.balances.find(
                (balance: any) => balance.asset_type === "native"
            );

            if (!xlmBalance) {
                return { data: 0, isError: false };
            }

            const balance = parseFloat(xlmBalance.balance);
            return { data: balance, isError: false };
        } catch (error) {
            console.error("Error getting Stellar balance:", error);
            return {
                data: 0,
                isError: true,
                errorMessage: (error as Error).message
            };
        }
    }

    async getAllTokenBalances(): Promise<StellarTokenBalancesResult> {
        try {
            const account = await this._server.loadAccount(this._address);
            const tokens: StellarTokenBalance[] = [];

            for (const balance of account.balances) {
                if (balance.asset_type === "native") {
                    // Native XLM token is already handled in getNativeTokenBalance
                    continue;
                }

                if (
                    balance.asset_type === "credit_alphanum4" ||
                    balance.asset_type === "credit_alphanum12"
                ) {
                    const tokenBalance: StellarTokenBalance = {
                        tokenContract: balance.asset_issuer,
                        tokenSymbol: balance.asset_code,
                        tokenName: balance.asset_code,
                        balance: parseFloat(balance.balance),
                        balanceUSD: 0, // Price calculation would require external API integration
                        price: 0,
                        decimals: 7,
                        platform: CHAINS.STELLAR,
                        isNativeToken: false,
                        change24h: 0
                    };
                    tokens.push(tokenBalance);
                }
            }

            return { isError: false, data: tokens };
        } catch (error) {
            console.error("Error getting Stellar token balances:", error);
            return {
                isError: true,
                errorMessage: (error as Error).message
            };
        }
    }

    async getMinimumBalance(): Promise<number> {
        try {
            const account = await this._server.loadAccount(this._address);
            const subentryCount = account.subentry_count;
            // Minimum balance = (2 + number of subentries) * base reserve
            const minBalance = (2 + subentryCount) * STELLAR_CONSTANTS.MIN_BALANCE;
            return minBalance;
        } catch (error) {
            console.error("Error getting minimum balance:", error);
            return STELLAR_CONSTANTS.MIN_BALANCE * 2; // Return basic minimum
        }
    }

    async canSendAmount(amount: string): Promise<{ canSend: boolean; errorMessage?: string }> {
        try {
            const balance = await this.getNativeTokenBalance();
            if (balance.isError) {
                return { canSend: false, errorMessage: "Failed to get balance" };
            }

            const minBalance = await this.getMinimumBalance();
            const availableBalance = balance.data - minBalance;
            const sendAmount = parseFloat(amount);

            if (sendAmount > availableBalance) {
                return {
                    canSend: false,
                    errorMessage: `Insufficient funds. Available: ${formatStellarAmount(
                        availableBalance
                    )} XLM`
                };
            }

            return { canSend: true };
        } catch (error) {
            return { canSend: false, errorMessage: (error as Error).message };
        }
    }

    async sendXLM(params: StellarSendParams): Promise<StellarSendResult> {
        try {
            const { destinationAddress, amount, memo, useFreighter = false, privateKey } = params;

            // Load sender account
            const sourceAccount = await this._server.loadAccount(this._address);

            // Create transaction
            const transaction = new TransactionBuilder(sourceAccount, {
                fee: STELLAR_CONSTANTS.BASE_FEE.toString(),
                networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE
            }).addOperation(
                Operation.payment({
                    destination: destinationAddress,
                    asset: Asset.native(),
                    amount: amount
                })
            );

            // Add memo if provided
            if (memo) {
                transaction.addMemo(Memo.text(memo));
            }

            const builtTransaction = transaction.setTimeout(30).build();

            let signedTransaction;

            if (useFreighter) {
                // Use Freighter for signing
                const freighterAddress = await getAddress();
                if (freighterAddress.address !== this._address) {
                    return {
                        isError: true,
                        errorMessage: "Freighter address does not match wallet address"
                    };
                }

                const signResult = await signTransaction(builtTransaction.toXDR());
                signedTransaction =
                    typeof signResult === "string" ? signResult : signResult.signedTxXdr;
            } else if (privateKey) {
                // Use private key
                const keypair = Keypair.fromSecret(privateKey);
                builtTransaction.sign(keypair);
                signedTransaction = builtTransaction.toXDR();
            } else {
                return {
                    isError: true,
                    errorMessage: "Either Freighter or private key is required"
                };
            }

            // Submit transaction
            const result = await this._server.submitTransaction(
                TransactionBuilder.fromXDR(signedTransaction, STELLAR_CONFIG.NETWORK_PASSPHRASE)
            );

            return {
                isError: false,
                hash: result.hash
            };
        } catch (error) {
            console.error("Error sending XLM:", error);
            return {
                isError: true,
                errorMessage: (error as Error).message
            };
        }
    }

    async sendPayment(params: StellarAssetSendParams): Promise<StellarSendResult> {
        try {
            const {
                destinationAddress,
                amount,
                asset,
                issuer,
                memo,
                useFreighter = false,
                privateKey
            } = params;

            if (!issuer) {
                return {
                    isError: true,
                    errorMessage: "Issuer must be specified for custom assets"
                };
            }

            // Load sender account
            const sourceAccount = await this._server.loadAccount(this._address);

            // Create asset
            const stellarAsset = new Asset(asset, issuer);

            // Create transaction
            const transaction = new TransactionBuilder(sourceAccount, {
                fee: STELLAR_CONSTANTS.BASE_FEE.toString(),
                networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE
            }).addOperation(
                Operation.payment({
                    destination: destinationAddress,
                    asset: stellarAsset,
                    amount: amount
                })
            );

            // Add memo if provided
            if (memo) {
                transaction.addMemo(Memo.text(memo));
            }

            const builtTransaction = transaction.setTimeout(30).build();

            let signedTransaction;

            if (useFreighter) {
                // Use Freighter for signing
                const freighterAddress = await getAddress();
                if (freighterAddress.address !== this._address) {
                    return {
                        isError: true,
                        errorMessage: "Freighter address does not match wallet address"
                    };
                }

                const signResult = await signTransaction(builtTransaction.toXDR());
                signedTransaction =
                    typeof signResult === "string" ? signResult : signResult.signedTxXdr;
            } else if (privateKey) {
                // Use private key
                const keypair = Keypair.fromSecret(privateKey);
                builtTransaction.sign(keypair);
                signedTransaction = builtTransaction.toXDR();
            } else {
                return {
                    isError: true,
                    errorMessage: "Either Freighter or private key is required"
                };
            }

            // Submit transaction
            const result = await this._server.submitTransaction(
                TransactionBuilder.fromXDR(signedTransaction, STELLAR_CONFIG.NETWORK_PASSPHRASE)
            );

            return {
                isError: false,
                hash: result.hash
            };
        } catch (error) {
            console.error("Error sending Stellar payment:", error);
            return {
                isError: true,
                errorMessage: (error as Error).message
            };
        }
    }

    async addTrustline(params: {
        assetCode: string;
        issuer: string;
        useFreighter?: boolean;
        privateKey?: string;
    }): Promise<StellarSendResult> {
        try {
            const { assetCode, issuer, useFreighter = false, privateKey } = params;

            // Load sender account
            const sourceAccount = await this._server.loadAccount(this._address);

            // Create asset
            const asset = new Asset(assetCode, issuer);

            // Create transaction
            const transaction = new TransactionBuilder(sourceAccount, {
                fee: STELLAR_CONSTANTS.BASE_FEE.toString(),
                networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE
            }).addOperation(
                Operation.changeTrust({
                    asset: asset
                })
            );

            const builtTransaction = transaction.setTimeout(30).build();

            let signedTransaction;

            if (useFreighter) {
                // Use Freighter for signing
                const freighterAddress = await getAddress();
                if (freighterAddress.address !== this._address) {
                    return {
                        isError: true,
                        errorMessage: "Freighter address does not match wallet address"
                    };
                }

                const signResult = await signTransaction(builtTransaction.toXDR());
                signedTransaction =
                    typeof signResult === "string" ? signResult : signResult.signedTxXdr;
            } else if (privateKey) {
                // Use private key
                const keypair = Keypair.fromSecret(privateKey);
                builtTransaction.sign(keypair);
                signedTransaction = builtTransaction.toXDR();
            } else {
                return {
                    isError: true,
                    errorMessage: "Either Freighter or private key is required"
                };
            }

            // Submit transaction
            const result = await this._server.submitTransaction(
                TransactionBuilder.fromXDR(signedTransaction, STELLAR_CONFIG.NETWORK_PASSPHRASE)
            );

            return {
                isError: false,
                hash: result.hash
            };
        } catch (error) {
            console.error("Error adding trustline:", error);
            return {
                isError: true,
                errorMessage: (error as Error).message
            };
        }
    }
}
