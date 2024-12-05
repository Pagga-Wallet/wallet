import { Buffer } from "buffer";
import {
    Asset,
    Factory,
    JettonRoot,
    MAINNET_FACTORY_ADDR,
    Pool,
    PoolType,
    VaultNative,
    VaultJetton,
} from "@dedust/sdk";
import {
    Address,
    Cell,
    TonClient,
    beginCell,
    WalletContractV4,
    WalletContractV3R1,
    WalletContractV3R2,
    comment,
    internal,
    toNano,
    TonClient4,
    JettonMaster,
    fromNano,
    loadStateInit,
    storeStateInit,
} from "@ton/ton";
import { ethers } from "ethers";
import { mnemonicValidate } from "ton-crypto";
import { Coins } from "ton3";
import { cryptographyController } from "@/shared/lib";
import { workchain } from "@/shared/lib/consts/ton/index";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { TON_ADDRESS_INTERFACES } from "@/shared/lib/types/multichainAccount";
import { tonAPIClient, tonClient4 } from "../../tonapi";
import { withFallback } from "../lib/helpers/withFallback";
import {
    ISendSwapMessageWithFee,
    TonTxDTO,
    TransObject,
    TransToSignJetton,
    TransToSignTon,
    TransferJettonDTO,
    TransferTonDTO,
} from "../lib/types";
import { TransferOptions } from "./../lib/types/";
import { TokenWallet } from "./jettonApi";

window.Buffer = Buffer;
const standbyV2Client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "94d8d3dde3b37be15e77baf5c3800bcafc5dcb8ec9f50c6b14bb8ed9fd79cb62",
});

// todo: убрать все интерфейсы, связанные с тонконнектом, в папку моделей тонконнекта
interface SignRawMessage {
    address: string;
    amount: string; // (decimal string): number of nanocoins to send.
    payload?: string; // (string base64, optional): raw one-cell BoC encoded in Base64.
    stateInit?: string; // (string base64, optional): raw once-cell BoC encoded in Base64.
}

export class TonWalletService {
    // private readonly client: TonClient4;
    public readonly publicKey: string;
    public readonly tonAddress: string;
    public readonly version: TON_ADDRESS_INTERFACES;

    constructor(publicKey: string, tonAddress: string, version: TON_ADDRESS_INTERFACES) {
        this.publicKey = publicKey;
        this.tonAddress = tonAddress;
        this.version = version;
    }

    public static createWalletByVersion(
        version: TON_ADDRESS_INTERFACES = TON_ADDRESS_INTERFACES.V4,
        publicKey: string
    ): WalletContractV4 {
        switch (version) {
            case TON_ADDRESS_INTERFACES.V4:
                return WalletContractV4.create({
                    workchain,
                    publicKey: Buffer.from(publicKey, "hex"),
                });
            case TON_ADDRESS_INTERFACES.V3R2:
                return WalletContractV3R2.create({
                    workchain,
                    publicKey: Buffer.from(publicKey, "hex"),
                });
            case TON_ADDRESS_INTERFACES.V3R1:
                return WalletContractV3R1.create({
                    workchain,
                    publicKey: Buffer.from(publicKey, "hex"),
                });
        }
    }

    // метод для быстрого получения баланса TON (для жетонов брать балансы из tonapi)
    public async balanceTon(version: TON_ADDRESS_INTERFACES = this.version): Promise<string> {
        const balanceTonMethod = async (
            client: TonClient4,
            version: TON_ADDRESS_INTERFACES = this.version
        ) => {
            const wallet = TonWalletService.createWalletByVersion(version, this.publicKey);
            const contract = client.open(wallet);
            const bal = await contract.getBalance();
            return fromNano(bal);
        };

        return withFallback(balanceTonMethod, version);
    }

    public async sendTon(
        txData: TonTxDTO,
        secretKey: string,
        version: TON_ADDRESS_INTERFACES = this.version
    ): Promise<boolean> {
        const sendTonMethod = async (
            client: TonClient4,
            txData: TonTxDTO,
            secretKey: string,
            version: TON_ADDRESS_INTERFACES
        ) => {
            try {
                const wallet = TonWalletService.createWalletByVersion(version, this.publicKey);
                const contract = client.open(wallet);
                const seqno: number = await contract.getSeqno();
                if (!Address.parse(txData.to).toString()) {
                    console.error("Invalid receiver address");
                    return false;
                }
                let comm;
                if (txData.comment) comm = comment(txData.comment);
                const body = txData.data ? Cell.fromBase64(txData.data) : undefined;
                // console.log("comm", comm, txData.comment);
                // console.log("body", body);
                const msgs = [
                    internal({
                        value: BigInt(txData.amount),
                        to: Address.parse(txData.to),
                        bounce: false,
                        body: body ?? comm,
                    }),
                ];
                const transfer = contract.createTransfer({
                    seqno,
                    secretKey: Buffer.from(secretKey, "hex"),
                    sendMode: 1 + 2,
                    messages: msgs,
                });
                await contract.send(transfer);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        };

        return await withFallback(sendTonMethod, txData, secretKey, version);
    }

    // метод для упаковки state init, приходящего с тонконнекта
    private static parseStateInit(stateInit: string) {
        const { code, data } = loadStateInit(Cell.fromBase64(stateInit).asSlice());
        return { code, data };
    }

    // метод для подписи готовых месседжей, приходящих из тонконнекта
    public async sendRawTrx(
        mnemonic: string,
        version: TON_ADDRESS_INTERFACES = this.version,
        transArray: SignRawMessage[]
    ): Promise<boolean> {
        const sendRawTrxMethod = async (
            client: TonClient4,
            mnemonic: string,
            version: TON_ADDRESS_INTERFACES,
            transArray: SignRawMessage[]
        ) => {
            try {
                const wallet = await cryptographyController.tonWalletFromUnknownMnemonic(mnemonic);
                const walletContract = TonWalletService.createWalletByVersion(
                    version,
                    this.publicKey
                );
                const contract = client.open(walletContract);
                const seqno: number = await contract.getSeqno();

                const balance: bigint = await contract.getBalance();

                for (const trans of transArray) {
                    if (Number(balance) < Number(trans.amount)) {
                        console.error(
                            `ERROR: balance < value. Value is ${trans.amount}, when the balance is ${balance}`
                        );
                        return false;
                    }

                    if (!Address.parse(trans.address).toString()) {
                        console.error("ERROR: !Address");
                        return false;
                    }
                }

                const msgs = transArray.map((trans) => {
                    return internal({
                        value: BigInt(trans.amount),
                        to: Address.parse(trans.address),
                        bounce: false,
                        body: trans.payload ? Cell.fromBase64(trans.payload) : undefined,
                        init: trans.stateInit
                            ? TonWalletService.parseStateInit(trans.stateInit)
                            : undefined,
                    });
                });

                const transfer = contract.createTransfer({
                    seqno,
                    secretKey: Buffer.from(wallet.secretKey, "hex"),
                    sendMode: 1 + 2,
                    messages: msgs,
                });
                await contract.send(transfer);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        };

        return await withFallback(sendRawTrxMethod, mnemonic, version, transArray);
    }

    // метод, который подрписывает и трансферит транзакцию в TON
    public async signMsg(
        txData: TransToSignTon,
        mnemonic: string,
        version: TON_ADDRESS_INTERFACES = this.version
    ): Promise<boolean> {
        try {
            const wallet = await cryptographyController.tonWalletFromUnknownMnemonic(mnemonic);
            // console.log("wallet", wallet);
            const sentTx = await this.sendTon(
                {
                    to: txData.to.toString({ bounceable: false }),
                    amount: txData.amount,
                    data: txData.data,
                    comment: txData.comment,
                },
                wallet.secretKey,
                version
            );
            console.log("sentTx", sentTx);

            return sentTx;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async transferTon({
        to,
        amount,
        mnemonics,
        memo = "",
    }: TransferTonDTO): Promise<boolean> {
        try {
            const receiver = Address.parse(to);
            if (!receiver.toString({ bounceable: false })) throw new Error("Invalid receiver");

            return await this.signMsg(
                {
                    to: receiver,
                    amount: toNano(amount).toString(),
                    comment: memo,
                },
                mnemonics
            );
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    private async resolveJettonAddressFor(
        jettonMasterAddress: Address,
        userContractAddress: Address
    ): Promise<Address | undefined> {
        const resolveJettonAddressForMethod = async (
            client: TonClient4,
            jettonMasterAddress: Address,
            userContractAddress: Address
        ) => {
            try {
                const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));
                jettonMaster.getJettonData();
                const address = await jettonMaster.getWalletAddress(userContractAddress);
                return address;
            } catch (err) {
                // standbyV2Client
                const waletAddress = await standbyV2Client.runMethod(
                    jettonMasterAddress,
                    "get_wallet_address",
                    [
                        {
                            type: "slice",
                            cell: beginCell().storeAddress(userContractAddress).endCell(),
                        },
                    ]
                );
                try {
                    const cell = waletAddress.stack.readCell();
                    const address = cell.beginParse().loadAddress();
                    return address;
                } catch {
                    console.error(err);
                    return undefined;
                }
            }
        };

        return await withFallback(
            resolveJettonAddressForMethod,
            jettonMasterAddress,
            userContractAddress
        );
    }

    // метод, который подписывает и трансферит транзакцию любого жеттона (любой токен на TON, кроме самого TON)
    public async transferJetton({
        to,
        amount,
        mnemonics,
        tokenAddress,
        memo = "",
    }: TransferJettonDTO): Promise<boolean> {
        try {
            const tokenParsedAddress = Address.parse(tokenAddress);
            const receiver = Address.parse(to);
            if (!receiver.toString({ bounceable: false })) throw new Error("Invalid receiver");
            const jettonData = await tonAPIClient.getJettonDataById({
                jettonAddress: tokenAddress,
            });

            const dataJetton = TonWalletService.sendJettonToBoc(
                {
                    to: receiver,
                    amount: ethers.parseUnits(amount.toString(), jettonData.decimals).toString(),
                    comment: memo,
                },
                this.tonAddress
            );

            const jettonWallet = await this.resolveJettonAddressFor(
                tokenParsedAddress,
                Address.parse(this.tonAddress)
            );

            if (!jettonWallet) {
                return false;
            }

            const txToTon: TransToSignTon = {
                to: jettonWallet,
                amount: new Coins("0.2").toNano(),
                data: dataJetton,
            };

            const result = await this.signMsg(txToTon, mnemonics);
            // console.log('result', result)
            return result;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // метод, который подписывает и трансферит транзакцию NFT на TON
    public async signMsgNFT(
        addressNFT: string,
        addressTo: string,
        mnemonic: string,
        message?: string
    ): Promise<boolean> {
        const dataJ = TonWalletService.sendNFTToBoc(addressTo, this.tonAddress, message);

        const trToTon: TransToSignTon = {
            to: Address.parse(addressNFT),
            amount: new Coins("0.2").toNano(),
            data: dataJ,
        };

        const hash = await this.signMsg(trToTon, mnemonic);

        return hash;
    }

    public static sendJettonToBoc(tr: TransToSignJetton, addressUser: string): string {
        const transJetton: TransferOptions = {
            queryId: 1,
            tokenAmount: BigInt(tr.amount),
            to: Address.parse(tr.to.toString()), // to address
            responseAddress: Address.parse(addressUser.toString()),
            comment: tr.comment,
        };

        const boc = TokenWallet.buildTransferMessage(transJetton);

        const base64 = boc.toBoc().toString("base64");

        return base64;
    }

    public static sendNFTToBoc(addressTo: string, addressUser: string, message?: string): string {
        const boc = TokenWallet.buildNFTTransferMessage(addressTo, addressUser, message);

        const base64 = boc.toBoc().toString("base64");
        return base64;
    }

    public async getStateInit({ version }: { version: string }) {
        let wallet = WalletContractV4.create({
            workchain,
            publicKey: Buffer.from(this.publicKey, "hex"),
        });
        if (version === "V3R1") {
            wallet = WalletContractV3R1.create({
                workchain,
                publicKey: Buffer.from(this.publicKey, "hex"),
            });
        }
        if (version === "V3R2") {
            wallet = WalletContractV3R2.create({
                workchain,
                publicKey: Buffer.from(this.publicKey, "hex"),
            });
        }

        const initialCode = wallet.init.code;
        const initialData = wallet.init.data;
        const stateInitCell = beginCell()
            .store(storeStateInit({ code: initialCode, data: initialData }))
            .endCell();

        return {
            stateInit: stateInitCell.toBoc({ idx: false }).toString("base64"),
            wallet,
        };
    }

    // свап тона в любой жеттон
    // public async SwapTonToJetton(
    //     tokenAddress: string,
    //     tonAmountIn: string,
    //     mnemonic: string,
    //     version: TON_ADDRESS_INTERFACES = this.version
    // ): Promise<boolean> {
    //     const TonWalletServiceData = await cryptographyController.tonWalletFromUnknownMnemonic(
    //         mnemonic
    //     );

    //     const factory = this.client.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
    //     const jetton = this.client.open(JettonRoot.createFromAddress(Address.parse(tokenAddress)));
    //     const pool = this.client.open(
    //         Pool.createFromAddress(
    //             await factory.getPoolAddress({
    //                 poolType: PoolType.VOLATILE,
    //                 assets: [Asset.native(), Asset.jetton(jetton.address)],
    //             })
    //         )
    //     );
    //     const nativeVault = this.client.open(
    //         VaultNative.createFromAddress(await factory.getVaultAddress(Asset.native()))
    //     );
    //     const lastBlock = await this.client.getLastBlock();
    //     const poolState = await this.client.getAccountLite(lastBlock.last.seqno, pool.address);
    //     const vaultState = await this.client.getAccountLite(
    //         lastBlock.last.seqno,
    //         nativeVault.address
    //     );

    //     const amountIn = toNano(tonAmountIn); // ton swap amount
    //     const DeWalletFee = toNano(Number(tonAmountIn) * 0.01); // ton swap amount
    //     const { amountOut: expectedAmountOut } = await pool.getEstimatedSwapOut({
    //         assetIn: Asset.native(),
    //         amountIn,
    //     });

    //     // Slippage handling (1%)
    //     const minAmountOut = (expectedAmountOut * 99n) / 100n; // expectedAmountOut - 1%
    //     try {
    //         if (poolState.account.state.type !== "active") {
    //             throw new Error("Pool is not exist.");
    //         }
    //         if (vaultState.account.state.type !== "active") {
    //             throw new Error("Native Vault is not exist.");
    //         }
    //         const swapBody = TokenWallet.buildSwapMessageTonToJetton({
    //             amount: amountIn,
    //             poolAddress: pool.address,
    //             limit: minAmountOut,
    //         });
    //         await this.sendSwapMessageWithFee({
    //             publicKey: TonWalletServiceData.publicKey,
    //             secretKey: TonWalletServiceData.secretKey,
    //             Swapfee: DeWalletFee,
    //             amountIn,
    //             swapBody,
    //             contractAddress: nativeVault.address,
    //             contractDedustFee: toNano("0.25"),
    //             version,
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    //     return true;
    // }

    // свап жеттона в тон
    // public async SwapJettonToTon(
    //     tokenAddress: string,
    //     jettonAmountIn: string,
    //     deWallFee: bigint,
    //     decimals: number,
    //     mnemonic: string,
    //     version: TON_ADDRESS_INTERFACES = this.version
    // ): Promise<boolean> {
    //     const TonWalletServiceData = await cryptographyController.tonWalletFromUnknownMnemonic(
    //         mnemonic
    //     );

    //     let currentSenderAddress = Address.parse(TonWalletServiceData.tonAddress);
    //     if (version === "V3R1") {
    //         currentSenderAddress = Address.parse(TonWalletServiceData.addressV3R1);
    //     }
    //     if (version === "V3R2") {
    //         currentSenderAddress = Address.parse(TonWalletServiceData.addressV3R2);
    //     }
    //     const factory = this.client.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
    //     const scaleVault = this.client.open(
    //         await factory.getJettonVault(Address.parse(tokenAddress))
    //     );

    //     const scaleRoot = this.client.open(
    //         JettonRoot.createFromAddress(Address.parse(tokenAddress))
    //     );
    //     const scaleWallet = this.client.open(await scaleRoot.getWallet(currentSenderAddress));

    //     const amountIn = BigInt(Number(jettonAmountIn) * 10 ** decimals);

    //     const poolJetton = this.client.open(
    //         Pool.createFromAddress(
    //             await factory.getPoolAddress({
    //                 poolType: PoolType.VOLATILE,
    //                 assets: [Asset.jetton(scaleRoot.address), Asset.native()],
    //             })
    //         )
    //     );

    //     const lastBlock = await this.client.getLastBlock();
    //     const poolState = await this.client.getAccountLite(
    //         lastBlock.last.seqno,
    //         poolJetton.address
    //     );
    //     const vaultState = await this.client.getAccountLite(
    //         lastBlock.last.seqno,
    //         scaleWallet.address
    //     );

    //     const { amountOut: expectedAmountOut } = await poolJetton.getEstimatedSwapOut({
    //         assetIn: Asset.jetton(scaleRoot.address),
    //         amountIn,
    //     });
    //     const minAmountOut = (expectedAmountOut * 99n) / 100n; // expectedAmountOut - 1%

    //     try {
    //         if (poolState.account.state.type !== "active") {
    //             throw new Error("Pool is not exist.");
    //         }

    //         if (vaultState.account.state.type !== "active") {
    //             throw new Error("Jetton Vault is not exist.");
    //         }

    //         const swapBody = TokenWallet.buildSwapMessageJettonWallet({
    //             amount: amountIn,
    //             destination: scaleVault.address,
    //             responseAddress: currentSenderAddress,
    //             forwardAmount: toNano("0.25"),
    //             forwardPayload: VaultJetton.createSwapPayload({
    //                 poolAddress: poolJetton.address,
    //                 limit: minAmountOut,
    //             }),
    //         });

    //         await this.sendSwapMessageWithFee({
    //             publicKey: TonWalletServiceData.publicKey,
    //             secretKey: TonWalletServiceData.secretKey,
    //             Swapfee: deWallFee,
    //             amountIn: toNano("0.25"),
    //             swapBody,
    //             contractAddress: scaleWallet.address,
    //             contractDedustFee: toNano("0.25"),
    //             version,
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    //     return true;
    // }

    // свап жеттона в жеттон
    // public async SwapJettonToJetton(
    //     tokenAddress1: string,
    //     tokenAddress2: string,
    //     jettonAmountIn: string,
    //     deWallFee: bigint,
    //     decimals: number,
    //     mnemonic: string,
    //     version: TON_ADDRESS_INTERFACES = this.version
    // ): Promise<boolean> {
    //     const tonClient = this.client;
    //     const TonWalletServiceData = await cryptographyController.tonWalletFromUnknownMnemonic(
    //         mnemonic
    //     );

    //     let currentSenderAddress = Address.parse(TonWalletServiceData.tonAddress);

    //     if (version === "V3R1") {
    //         currentSenderAddress = Address.parse(TonWalletServiceData.addressV3R1);
    //     }

    //     if (version === "V3R2") {
    //         currentSenderAddress = Address.parse(TonWalletServiceData.addressV3R2);
    //     }

    //     const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
    //     const jetton1Vault = tonClient.open(
    //         await factory.getJettonVault(Address.parse(tokenAddress1))
    //     );

    //     const jettonRoot = tonClient.open(
    //         JettonRoot.createFromAddress(Address.parse(tokenAddress1))
    //     );
    //     const jettonWallet = tonClient.open(await jettonRoot.getWallet(currentSenderAddress));

    //     const amountIn = BigInt(Number(jettonAmountIn) * 10 ** decimals);

    //     const JETTON1 = Asset.jetton(Address.parse(tokenAddress1));
    //     const TON = Asset.native();
    //     const JETTON2 = Asset.jetton(Address.parse(tokenAddress2));

    //     const TON_JETTON1_Pool = tonClient.open(
    //         await factory.getPool(PoolType.VOLATILE, [TON, JETTON1])
    //     );

    //     const TON_JETTON2_Pool = tonClient.open(
    //         await factory.getPool(PoolType.VOLATILE, [TON, JETTON2])
    //     );

    //     const lastBlock = await tonClient.getLastBlock();
    //     const poolState = await tonClient.getAccountLite(
    //         lastBlock.last.seqno,
    //         TON_JETTON1_Pool.address
    //     );
    //     const vaultState = await tonClient.getAccountLite(
    //         lastBlock.last.seqno,
    //         jettonWallet.address
    //     );

    //     const poolState2 = await tonClient.getAccountLite(
    //         lastBlock.last.seqno,
    //         TON_JETTON2_Pool.address
    //     );
    //     const vaultState2 = await tonClient.getAccountLite(
    //         lastBlock.last.seqno,
    //         jettonWallet.address
    //     );

    //     const { amountOut: expectedAmountOut1 } = await TON_JETTON1_Pool.getEstimatedSwapOut({
    //         assetIn: JETTON1,
    //         amountIn,
    //     });

    //     const minAmountOut = (expectedAmountOut1 * 99n) / 100n; // expectedAmountOut - 1% slippage

    //     try {
    //         if (poolState.account.state.type !== "active") {
    //             throw new Error("Pool is not exist.");
    //         }

    //         if (vaultState.account.state.type !== "active") {
    //             throw new Error("Jetton Vault is not exist.");
    //         }

    //         if (poolState2.account.state.type !== "active") {
    //             throw new Error("Pool is not exist.");
    //         }

    //         if (vaultState2.account.state.type !== "active") {
    //             throw new Error("Jetton Vault is not exist.");
    //         }

    //         const swapBody = TokenWallet.buildSwapMessageJettonWallet({
    //             amount: amountIn,
    //             destination: jetton1Vault.address,
    //             responseAddress: currentSenderAddress, // return gas to user
    //             forwardAmount: toNano("0.25"),
    //             forwardPayload: VaultJetton.createSwapPayload({
    //                 poolAddress: TON_JETTON1_Pool.address,
    //                 limit: minAmountOut,
    //                 next: { poolAddress: TON_JETTON2_Pool.address }, // next step: TON -> BOLT
    //             }),
    //         });

    //         await this.sendSwapMessageWithFee({
    //             publicKey: TonWalletServiceData.publicKey,
    //             secretKey: TonWalletServiceData.secretKey,
    //             Swapfee: deWallFee,
    //             amountIn: toNano("0.25"),
    //             swapBody,
    //             contractAddress: jettonWallet.address,
    //             contractDedustFee: toNano("0.25"),
    //             version,
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    //     return true;
    // }

    // получение ожидаемой суммы свапа
    // public async GetEstimatedSwapOut(
    //     tokenName1: string,
    //     tokenName2: string,
    //     tokenAmount1: string,
    //     tokenAddress1: string,
    //     tokenAddress2: string,
    //     decimals1: number,
    //     decimals2: number
    // ): Promise<string> {
    //     if (tokenAmount1 === "0" || tokenAmount1 === "0.") {
    //         return "0";
    //     }
    //     if (tokenAmount1 === "") {
    //         return "";
    //     }

    //     const tonClient = this.client;

    //     const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));

    //     if (tokenName1 === "TON" && tokenName2 !== "TON") {
    //         const JETTON = Asset.jetton(Address.parse(tokenAddress2));
    //         const TON = Asset.native();
    //         const PoolTonToJetton = tonClient.open(
    //             await factory.getPool(PoolType.VOLATILE, [TON, JETTON])
    //         );

    //         const { amountOut: expectedAmountOutTonToJetton } =
    //             await PoolTonToJetton.getEstimatedSwapOut({
    //                 assetIn: TON,
    //                 amountIn: toNano(tokenAmount1),
    //             });

    //         const numberValue: number = Number(expectedAmountOutTonToJetton) / 10 ** decimals2; // Number(fromNano(expectedAmountOutTonToJetton))

    //         return formatNumber(String(numberValue));
    //     }
    //     if (tokenName1 !== "TON" && tokenName2 === "TON") {
    //         const JETTON = Asset.jetton(Address.parse(tokenAddress1));
    //         const TON = Asset.native();
    //         const PoolJettonToTon = tonClient.open(
    //             await factory.getPool(PoolType.VOLATILE, [TON, JETTON])
    //         );

    //         const { amountOut: expectedAmountOutJettonToTon } =
    //             await PoolJettonToTon.getEstimatedSwapOut({
    //                 assetIn: JETTON,
    //                 amountIn: BigInt(Number(tokenAmount1) * 10 ** decimals1),
    //             });

    //         const numberValue: number = Number(fromNano(expectedAmountOutJettonToTon));

    //         return formatNumber(String(numberValue));
    //     }
    //     if (tokenName1 !== "TON" && tokenName2 !== "TON") {
    //         const JETTON1 = Asset.jetton(Address.parse(tokenAddress1));
    //         const TON = Asset.native();
    //         const JETTON2 = Asset.jetton(Address.parse(tokenAddress2));

    //         const TON_JETTON1_Pool = tonClient.open(
    //             await factory.getPool(PoolType.VOLATILE, [TON, JETTON1])
    //         );
    //         const TON_JETTON2_Pool = tonClient.open(
    //             await factory.getPool(PoolType.VOLATILE, [TON, JETTON2])
    //         );

    //         const { amountOut: expectedAmountOut1 } = await TON_JETTON1_Pool.getEstimatedSwapOut({
    //             assetIn: JETTON1,
    //             amountIn: BigInt(Number(tokenAmount1) * 10 ** decimals1),
    //         });

    //         const { amountOut: expectedAmountOut2 } = await TON_JETTON2_Pool.getEstimatedSwapOut({
    //             assetIn: Asset.native(),
    //             amountIn: expectedAmountOut1,
    //         });

    //         const numberValue: number = Number(expectedAmountOut2) / 10 ** decimals2;

    //         return formatNumber(String(numberValue));
    //     }

    //     return "";
    // }

    // public async sendSwapMessageWithFee({
    //     secretKey,
    //     Swapfee,
    //     amountIn,
    //     swapBody,
    //     contractAddress,
    //     contractDedustFee,
    //     version,
    // }: ISendSwapMessageWithFee): Promise<boolean> {
    //     let wallet = WalletContractV4.create({
    //         workchain,
    //         publicKey: Buffer.from(this.publicKey, "hex"),
    //     });
    //     if (version === "V3R1") {
    //         wallet = WalletContractV3R1.create({
    //             workchain,
    //             publicKey: Buffer.from(this.publicKey, "hex"),
    //         });
    //     }
    //     if (version === "V3R2") {
    //         wallet = WalletContractV3R2.create({
    //             workchain,
    //             publicKey: Buffer.from(this.publicKey, "hex"),
    //         });
    //     }

    //     const contract = this.client.open(wallet);
    //     const seqno: number = await contract.getSeqno();

    //     const msgs = [
    //         internal({
    //             value: Swapfee,
    //             to: Address.parse("EQCyTiL1t7QaufQQOxHD3u0J_GR2pn9NqLofI6BWT_lR43fZ"),
    //             bounce: false,
    //             body: comment("fee"),
    //             init: wallet.init,
    //         }),
    //         internal({
    //             value: contractDedustFee + amountIn,
    //             to: contractAddress,
    //             bounce: true,
    //             body: swapBody,
    //             init: wallet.init,
    //         }),
    //     ];

    //     const tr = contract.createTransfer({
    //         seqno,
    //         secretKey: Buffer.from(secretKey, "hex"),
    //         sendMode: 1,
    //         messages: msgs,
    //     });
    //     try {
    //         await contract.send(tr);
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    //     return true;
    // }
}
