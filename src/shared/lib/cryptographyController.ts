import {
    keyPairFromSeed,
    mnemonicToPrivateKey,
    mnemonicValidate as tonMnemonicValidate,
} from "@ton/crypto";
import { WalletContractV3R1, WalletContractV3R2, WalletContractV4 } from "@ton/ton";
import * as bip39 from "bip39";
import * as crypto from "crypto-js";
import { derivePath } from "ed25519-hd-key";
import { ethers } from "ethers";
import { TronWeb } from "tronweb";
import { TonWalletData } from "@/shared/lib/types";
import { workchain } from "./consts/ton/index";
import { TronWalletData } from "./types/tron/TronWalletData";

const globalSecret = "7275737369616e207761727368697020676f206675636b20796f757273656c66";
class CryptographyController {
    private _generateMnemonicBIP39(): string {
        return bip39.generateMnemonic();
    }

    // этот метод для получения валлетов из мнемоников как у траста, сгенерированных через bip39
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
            secretKey: kp.secretKey.toString("hex"),
        };
    }

    // этот метод для получения валлетов из мнемоников TON типа, сгенерированных через метод из ton-crypto
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
            secretKey: keyPair.secretKey.toString("hex"),
        };
    }

    private async _ethereumWalletFromTonMnemonic(mnemonic: string): Promise<ethers.HDNodeWallet> {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const pk = derivePath("m/44'/607'/0'", seed.toString("hex"));
        const wallet = ethers.HDNodeWallet.fromSeed(pk.key);
        return wallet;
    }

    private async _ethereumWalletFromBip39Mnemonic(mnemonic: string): Promise<ethers.HDNodeWallet> {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const wallet = ethers.HDNodeWallet.fromSeed(seed);
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

    private async _legacyTonWalletFromBip39Mnemonic(mnemonic: string): Promise<TonWalletData> {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const wallet = await this.getTonWalletFromBip39Mnemonic(seed.toString("hex").split(" "));
        return wallet;
    }

    private async _tonWalletFromBip39Mnemonic(mnemonic: string): Promise<TonWalletData> {
        const wallet = await this.getTonWalletFromBip39Mnemonic(mnemonic.split(" "));
        return wallet;
    }

    private async _tonWalletFromTonMnemonic(mnemonic: string): Promise<TonWalletData> {
        return await this.getTonWalletFromTonMnemonic(mnemonic.split(" "));
    }

    public async tonWalletFromUnknownMnemonic(
        mnemonic: string,
        valid?: boolean
    ): Promise<TonWalletData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._tonWalletFromTonMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._tonWalletFromBip39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    private async _tronWalletFromTONMnemonic(mnemonic: string): Promise<TronWalletData> {
        const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));
        const Trc20WalletAddress = TronWeb.address.fromPrivateKey(
            keyPair.publicKey.toString("hex").toLocaleUpperCase()
        );
        if (!Trc20WalletAddress) throw new Error("Error while creating tron wallet");
        return {
            address: Trc20WalletAddress,
            privateKey: keyPair.publicKey.toString("hex").replace(/^0x/, ""),
            publicKey: keyPair.secretKey.toString("hex").replace(/^0x/, ""),
        };
    }

    private async _tronWalletFromBIP39Mnemonic(mnemonic: string): Promise<TronWalletData> {
        const Trc20Wallet = TronWeb.fromMnemonic(mnemonic, "m/44'/195'/0'/0/0");
        return {
            address: Trc20Wallet.address,
            privateKey: Trc20Wallet.privateKey.replace(/^0x/, ""),
            publicKey: Trc20Wallet.publicKey.replace(/^0x/, ""),
        };
    }

    public async tronWalletFromUnknownMnemonic(mnemonic: string): Promise<TronWalletData> {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (isTONMnemonic) return this._tronWalletFromTONMnemonic(mnemonic);
        else if (isBIP39Mnemonic) return this._tronWalletFromBIP39Mnemonic(mnemonic);
        else throw new Error("Invalid mnemonic");
    }

    public async createMultichainWallet() {
        const mnemonics = this._generateMnemonicBIP39();
        const ethereumWallet = await this._ethereumWalletFromBip39Mnemonic(mnemonics);
        const tonWallet = await this._legacyTonWalletFromBip39Mnemonic(mnemonics);
        const tronWallet = await this._tronWalletFromBIP39Mnemonic(mnemonics);
        return {
            mainMnemonic: mnemonics,
            eth: ethereumWallet,
            ton: tonWallet,
            tron: tronWallet,
        };
    }

    public async importWallet(mnemonic: string) {
        const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
        const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
        if (!isTONMnemonic && !isBIP39Mnemonic) throw new Error("Invalid mnemonic");
        const tonWallet = await this.tonWalletFromUnknownMnemonic(mnemonic);
        const ethereumWallet = await this.ethereumHDWalletFromUnknownMnemonic(mnemonic);
        const tronWallet = await this.tronWalletFromUnknownMnemonic(mnemonic);
        return {
            mainMnemonic: mnemonic,
            eth: ethereumWallet,
            ton: tonWallet,
            tron: tronWallet,
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
                hashFromKey,
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
