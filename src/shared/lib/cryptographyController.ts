import { Keypair } from "@mysten/sui/dist/cjs/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import * as solana from "@solana/web3.js";
import {
    keyPairFromSeed,
    mnemonicToPrivateKey,
    mnemonicValidate as tonMnemonicValidate
} from "@ton/crypto";
import { WalletContractV3R1, WalletContractV3R2, WalletContractV4 } from "@ton/ton";
import * as bip39 from "bip39";
import * as crypto from "crypto-js";
import { derivePath } from "ed25519-hd-key";
import { ethers } from "ethers";
import { TronWeb } from "tronweb";
import { IUserWalletsData, SuiWalletData, TonWalletData } from "@/shared/lib/types";
import { workchain } from "./consts/ton/index";
import { SolanaWalletData } from "./types/solana/SolanaWalletData";
import { TronWalletData } from "./types/tron/TronWalletData";

const globalSecret = "7275737369616e207761727368697020676f206675636b20796f757273656c66";
class CryptographyController {
    private _generateMnemonicBIP39(): string {
        return bip39.generateMnemonic();
    }

    // bip39
    private async getTonWalletFromBip39Mnemonic(mnemonics: string[]): Promise<TonWalletData> {
        const joinedPhrase = mnemonics.join(" ").trim();
        const seed = await bip39.mnemonicToSeed(joinedPhrase);
        const pk = derivePath("m/44'/607'/0'", seed.toString("hex"));
        const kp = keyPairFromSeed(pk.key);
        const walletV4 = WalletContractV4.create({ workchain, publicKey: kp.publicKey });
        const walletV3R2 = WalletContractV3R2.create({ workchain, publicKey: kp.publicKey });
        const walletV3R1 = WalletContractV3R1.create({ workchain, publicKey: kp.publicKey });

        return {
            addressV4: walletV4.address.toString({ bounceable: false }),
            addressV3R2: walletV3R2.address.toString({ bounceable: false }),
            addressV3R1: walletV3R1.address.toString({ bounceable: false }),
            publicKey: kp.publicKey.toString("hex"),
            secretKey: kp.secretKey.toString("hex")
        };
    }

    // ton-crypto
    private async getTonWalletFromTonMnemonic(mnemonics: string[]): Promise<TonWalletData> {
        const keyPair = await mnemonicToPrivateKey(mnemonics);
        const walletV4 = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
        const walletV3R2 = WalletContractV3R2.create({ workchain, publicKey: keyPair.publicKey });
        const walletV3R1 = WalletContractV3R1.create({ workchain, publicKey: keyPair.publicKey });
        return {
            addressV4: walletV4.address.toString({ bounceable: false }),
            addressV3R2: walletV3R2.address.toString({ bounceable: false }),
            addressV3R1: walletV3R1.address.toString({ bounceable: false }),
            publicKey: keyPair.publicKey.toString("hex"),
            secretKey: keyPair.secretKey.toString("hex")
        };
    }

    // ETHEREUM

    private async _ethereumWalletFromTonMnemonic(mnemonic: string): Promise<ethers.HDNodeWallet> {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const pk = derivePath("m/44'/607'/0'", seed.toString("hex"));
        const wallet = ethers.HDNodeWallet.fromSeed(Uint8Array.from(pk.key));
        return wallet;
    }

    private async _ethereumWalletFromBip39Mnemonic(mnemonic: string): Promise<ethers.HDNodeWallet> {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const wallet = ethers.HDNodeWallet.fromSeed(Uint8Array.from(seed));
        return wallet;
    }

    public async ethereumHDWalletFromUnknownMnemonic(
        mnemonic: string
    ): Promise<ethers.HDNodeWallet> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._ethereumWalletFromTonMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._ethereumWalletFromBip39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    // SOLANA

    public async solanaKeypairFromMnemonic(mnemonic: string) {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const { key } = derivePath("m/44'/501'/0'", seed.toString("hex"));
        const keypair = solana.Keypair.fromSeed(Uint8Array.from(key));
        return keypair;
    }

    private async _solanaWalletFromTonMnemonic(mnemonic: string): Promise<SolanaWalletData> {
        const keypair = await this.solanaKeypairFromMnemonic(mnemonic);
        const privateKey = Buffer.from(keypair.secretKey).toString("hex");
        const publicKey = keypair.publicKey.toBase58();
        return {
            privateKey,
            address: publicKey
        };
    }

    private async _solanaWalletFromBip39Mnemonic(mnemonic: string): Promise<SolanaWalletData> {
        const keypair = await this.solanaKeypairFromMnemonic(mnemonic);
        const privateKey = Buffer.from(keypair.secretKey).toString("hex");
        const publicKey = keypair.publicKey.toBase58();
        return {
            privateKey,
            address: publicKey
        };
    }

    public async solanaWalletFromUnknownMnemonic(mnemonic: string): Promise<SolanaWalletData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._solanaWalletFromTonMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._solanaWalletFromBip39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    // SUI

    public async suiKeypairFromMnemonic(mnemonic: string): Promise<Keypair> {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const keypair = Ed25519Keypair.deriveKeypairFromSeed(seed.toString("hex"));
        return keypair;
    }

    private async _suiWalletFromTonMnemonic(mnemonic: string): Promise<SuiWalletData> {
        const keypair = await this.suiKeypairFromMnemonic(mnemonic);
        const privateKey = keypair.getSecretKey();
        const publicKey = keypair.getPublicKey().toSuiAddress();
        return {
            privateKey,
            address: publicKey
        };
    }

    private async _suiWalletFromBip39Mnemonic(mnemonic: string): Promise<SuiWalletData> {
        const keypair = await this.suiKeypairFromMnemonic(mnemonic);
        const privateKey = keypair.getSecretKey();
        const publicKey = keypair.getPublicKey().toSuiAddress();
        return {
            privateKey,
            address: publicKey
        };
    }

    public async suiWalletFromUnknownMnemonic(mnemonic: string): Promise<SuiWalletData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._suiWalletFromTonMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._suiWalletFromBip39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    // TON

    private async _tonWalletFromBip39Mnemonic(mnemonic: string): Promise<TonWalletData> {
        const wallet = await this.getTonWalletFromBip39Mnemonic(mnemonic.split(" "));
        return wallet;
    }

    private async _tonWalletFromTonMnemonic(mnemonic: string): Promise<TonWalletData> {
        return await this.getTonWalletFromTonMnemonic(mnemonic.split(" "));
    }

    public async tonWalletFromUnknownMnemonic(mnemonic: string): Promise<TonWalletData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._tonWalletFromTonMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._tonWalletFromBip39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    // TRON

    private async _tronWalletFromTONMnemonic(mnemonic: string): Promise<TronWalletData> {
        const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));
        const Trc20WalletAddress = TronWeb.address.fromPrivateKey(
            keyPair.publicKey.toString("hex").toLocaleUpperCase()
        );
        if (!Trc20WalletAddress) throw new Error("Error while creating tron wallet");
        return {
            address: Trc20WalletAddress,
            privateKey: keyPair.publicKey.toString("hex").replace(/^0x/, ""),
            publicKey: keyPair.secretKey.toString("hex").replace(/^0x/, "")
        };
    }

    private async _tronWalletFromBIP39Mnemonic(mnemonic: string): Promise<TronWalletData> {
        const Trc20Wallet = TronWeb.fromMnemonic(mnemonic, "m/44'/195'/0'/0/0");
        return {
            address: Trc20Wallet.address,
            privateKey: Trc20Wallet.privateKey.replace(/^0x/, ""),
            publicKey: Trc20Wallet.publicKey.replace(/^0x/, "")
        };
    }

    public async tronWalletFromUnknownMnemonic(mnemonic: string): Promise<TronWalletData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._tronWalletFromTONMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._tronWalletFromBIP39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    // GENERAL

    public async createMultichainWallet(): Promise<IUserWalletsData> {
        const mnemonic = this._generateMnemonicBIP39();
        const ethereumWallet = await this._ethereumWalletFromBip39Mnemonic(mnemonic);
        const tonWallet = await this._tonWalletFromBip39Mnemonic(mnemonic);
        const tronWallet = await this._tronWalletFromBIP39Mnemonic(mnemonic);
        const solanaWallet = await this._solanaWalletFromBip39Mnemonic(mnemonic);
        const suiWallet = await this._suiWalletFromBip39Mnemonic(mnemonic);

        return {
            mainMnemonic: mnemonic,
            eth: ethereumWallet,
            ton: tonWallet,
            tron: tronWallet,
            solana: solanaWallet,
            sui: suiWallet
        };
    }

    public async importWallet(mnemonic: string): Promise<IUserWalletsData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (!isTONMnemonic && !isBIP39Mnemonic) throw new Error("Invalid mnemonic");
        const tonWallet = await this.tonWalletFromUnknownMnemonic(mnemonic);
        const ethereumWallet = await this.ethereumHDWalletFromUnknownMnemonic(mnemonic);
        const tronWallet = await this.tronWalletFromUnknownMnemonic(mnemonic);
        const solanaWallet = await this.solanaWalletFromUnknownMnemonic(mnemonic);
        const suiWallet = await this.suiWalletFromUnknownMnemonic(mnemonic);

        return {
            mainMnemonic: mnemonic,
            eth: ethereumWallet,
            ton: tonWallet,
            tron: tronWallet,
            solana: solanaWallet,
            sui: suiWallet
        };
    }

    public KeyToHash(mnemonics: string, password: string) {
        try {
            const initializationVector = Buffer.from(ethers.randomBytes(16)).toString("hex");
            const secret = Buffer.from(password, "utf8").toString("hex");
            const key = initializationVector + secret + globalSecret;
            const hashFromKey = crypto.AES.encrypt(mnemonics, key).toString();
            return {
                iv: initializationVector.toString(),
                hashFromKey
            };
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public HashToKey(
        password: string,
        initializationVector: string,
        hash: string
    ): string | undefined {
        try {
            const secret = Buffer.from(password, "utf8").toString("hex");
            const key = initializationVector + secret + globalSecret;
            const decryptedData = crypto.AES.decrypt(hash, key).toString(crypto.enc.Utf8);
            return decryptedData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}

export const cryptographyController = new CryptographyController();
