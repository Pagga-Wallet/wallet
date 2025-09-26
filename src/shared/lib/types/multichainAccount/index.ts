import { HDNodeWallet } from "ethers";
import { SolanaWalletData } from "../solana/SolanaWalletData";
import { StellarWalletData } from "../stellar/StellarWalletData";
import { SuiWalletData } from "../sui/SuiWalletData";
import { TonWalletData } from "../ton/TonWalletData";
import { TronWalletData } from "../tron/TronWalletData";

export enum CHAINS {
    ETH = "ETH",
    BNB = "BNB",
    TON = "TON",
    TRON = "TRON",
    SOLANA = "SOLANA",
    SUI = "SUI",
    STELLAR = "STELLAR"
}

export type EVM_CHAINS = CHAINS.ETH | CHAINS.BNB;
export const EVM_CHAINS_ARRAY = [CHAINS.ETH, CHAINS.BNB];
export const isEVMChain = (chain: CHAINS): chain is EVM_CHAINS => EVM_CHAINS_ARRAY.includes(chain);

export enum TON_ADDRESS_INTERFACES {
    V4 = "V4",
    V3R1 = "V3R1",
    V3R2 = "V3R2"
}

export interface ITONWallet {
    publicKey: string;
    address: {
        V4: string;
        V3R1: string;
        V3R2: string;
    };
}

export interface IUserWalletsData {
    mainMnemonic: string;
    eth: HDNodeWallet;
    ton: TonWalletData;
    tron: TronWalletData;
    solana: SolanaWalletData;
    sui: SuiWalletData;
    stellar: StellarWalletData;
}

export interface IMonoWalletData {
    address: string;
}

export interface IStandartWalletData {
    publicKey: string;
    address: string;
}

export interface IMultiwallet {
    TON: ITONWallet;
    ETH: IStandartWalletData;
    TRON: IStandartWalletData;
    SOLANA: IMonoWalletData;
    SUI: IMonoWalletData;
    STELLAR: IStandartWalletData;
}

export interface IMultichainAccount {
    masterIV: string;
    masterHash: string;
    multiwallet: IMultiwallet;
    id: string;
    name?: string;
    emojiId?: string;
}

export interface BaseToken {
    tokenContract?: string;
    tokenID: string;
    tokenSymbol: string;
    tokenName: string;
    tokenIcon?: string;
    platform: CHAINS;
    decimals?: number;
    isNativeToken: boolean;
    price?: number;
}

export interface TokenBalance extends BaseToken {
    balance: number;
    balanceUSD: number;
    price: number;
    change24h?: number;
}

export interface TotalBalanceChainInfo {
    nativeToken: TokenBalance;
    tokens?: TokenBalance[];
}

type ChainBalances = Record<CHAINS, TotalBalanceChainInfo>;

export interface TotalBalance {
    totalUSDBalance: number;
    chains: ChainBalances;
}
