import { EthersError } from "ethers";
import { flatMap, groupBy, uniqBy } from "lodash";
import { CoinIds, coingeckoClient } from "@/shared/api/coingecko";
import { BNBWallet, EthereumWallet, getEVMWalletByChain } from "@/shared/api/evm";
import { getEVMAPIClientByChain } from "@/shared/api/evm";
import { parseEVMTokenTxn, parseEVMNativeTxn } from "@/shared/api/evm";
import { SolanaWallet } from "@/shared/api/solana";
import { StellarWallet } from "@/shared/api/stellar";
import { SuiWallet } from "@/shared/api/sui";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { TonWalletService } from "@/shared/api/ton";
import { tonAPIClient } from "@/shared/api/tonapi";
import {
    getAllJettonsBalancesDTOToTokenBalances,
    getAllNFTsDTOToNFTItems
} from "@/shared/api/tonapi";
import { getAccountEventsDTOToParsedTxn } from "@/shared/api/tonapi/lib/getAccountEventsDTOToParsedTx";
import { getTransferJettonHistoryDTOToParsedTxn } from "@/shared/api/tonapi/lib/getTransferJettonHistoryDTOToParsedTx";
import { TronAPI, parseTronNativeTxn, parseTronTokenTxn } from "@/shared/api/tron";
import { TronWallet } from "@/shared/api/tron/model/TronWallet";
import { SignRawMessage } from "@/shared/lib/connect/models";
import { WhitelistItem, tokensWhitelist } from "@/shared/lib/consts/token";
import { preciseAmount } from "@/shared/lib/helpers/formatNumber";
import { APIResponse, APIResponseFail } from "@/shared/lib/types";
import {
    BaseToken,
    CHAINS,
    IMultichainAccount,
    TON_ADDRESS_INTERFACES,
    TokenBalance,
    TotalBalance,
    isEVMChain
} from "@/shared/lib/types/multichainAccount";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { TransferTokenDTO } from "../lib/types";

export type TransferTokenResponse = APIResponse<BaseTxnParsed | null>;
// export type TransferTokenResponse = APIResponse<BaseTxnParsed | null>;

export class MultichainAccount {
    public readonly _account: IMultichainAccount;
    public readonly _ethAddress: string;
    public _tonWallet: TonWalletService;
    public _ethereumWallet: EthereumWallet;
    public _bnbWallet: BNBWallet;
    public _tronWallet: TronWallet;
    public _tronAPI: TronAPI;
    public _solanaWallet: SolanaWallet;
    public _stellarWallet: StellarWallet;
    public _suiWallet: SuiWallet;
    public _tonVersion: TON_ADDRESS_INTERFACES;

    constructor(account: IMultichainAccount, tonVersion: TON_ADDRESS_INTERFACES) {
        this._account = account;
        this._ethAddress = account.multiwallet.ETH.address;
        this._ethereumWallet = new EthereumWallet(this._ethAddress);
        this._bnbWallet = new BNBWallet(this._ethAddress);
        this._tronWallet = new TronWallet(this._account.multiwallet.TRON.address);
        this._solanaWallet = new SolanaWallet(this._account.multiwallet.SOLANA.address);
        this._stellarWallet = new StellarWallet(this._account.multiwallet.STELLAR.address);
        this._suiWallet = new SuiWallet(this._account.multiwallet.SUI.address);
        this._tonWallet = new TonWalletService(
            account.multiwallet.TON.publicKey,
            account.multiwallet.TON.address[tonVersion],
            tonVersion
        );
        this._tronAPI = new TronAPI(account.multiwallet.TRON.address);
        this._tonVersion = tonVersion;
    }

    getAddressInNetwork(chain: CHAINS): string {
        switch (chain) {
            case CHAINS.ETH:
                return this._account.multiwallet.ETH.address;
            case CHAINS.BNB:
                return this._account.multiwallet.ETH.address;
            case CHAINS.TRON:
                return this._account.multiwallet.TRON.address;
            case CHAINS.TON:
                return this._account.multiwallet.TON.address[this._tonVersion];
            case CHAINS.SOLANA:
                return this._account.multiwallet.SOLANA.address;
            case CHAINS.SUI:
                return this._account.multiwallet.SUI.address;
            case CHAINS.STELLAR:
                return this._account.multiwallet.STELLAR.address;
            default:
                throw new Error(`Unsupported chain: ${chain}`);
        }
    }

    async getAllNFTs() {
        const tonNFTs = await tonAPIClient.getAllNFTs({
            account: this.getAddressInNetwork(CHAINS.TON)
        });
        return getAllNFTsDTOToNFTItems(tonNFTs);
    }

    private async getImportedTokens(): Promise<Record<CHAINS, TokenBalance[]>> {
        const savedTokens = await telegramStorage.getImportedTokens();
        const savedTokensArr: WhitelistItem[] = flatMap(savedTokens, (addresses, chain) => {
            const chainKey = CHAINS[chain as keyof typeof CHAINS];
            return addresses.map(address => ({ contract: address, chain: chainKey }));
        });
        const list = [...tokensWhitelist, ...savedTokensArr];
        // get all saved tokens
        const tokens = await Promise.all(
            list.map(async item => {
                if (item.chain === CHAINS.TON) {
                    // for jettons
                    return await tonAPIClient.getJettonDataById({ jettonAddress: item.contract });
                } else if (item.chain === CHAINS.TRON) {
                    // for tron
                    const token = (
                        await this._tronAPI.getTokenByContractAddress({
                            contractaddress: item.contract
                        })
                    ).data;
                    if (!token) return null;
                    // Set icon from whitelist
                    else return { ...token, tokenIcon: item.overrideIcon ?? token.tokenIcon };
                } else if (isEVMChain(item.chain)) {
                    // for EVM chain tokens
                    const client = getEVMAPIClientByChain(this._ethAddress, item.chain);
                    const token = (
                        await client.getTokenByContractAddress({
                            contractaddress: item.contract
                        })
                    ).data;
                    if (!token) return null;
                    // Set icon from whitelist
                    else return { ...token, tokenIcon: item.overrideIcon ?? token.tokenIcon };
                } else return [];
            })
        );
        const tokensFiltered = tokens.filter((data): data is TokenBalance => data !== null); // clean tokens with invalid contract address

        const grouped = groupBy(tokensFiltered, value => value.platform) as Record<
            CHAINS,
            TokenBalance[]
        >;
        // stub for all CHAINS keys
        const defaultGrouped: Record<CHAINS, TokenBalance[]> = Object.values(CHAINS).reduce(
            (acc, chain) => {
                acc[chain] = [];
                return acc;
            },
            {} as Record<CHAINS, TokenBalance[]>
        );
        // merge with stub
        const mergedGrouped = { ...defaultGrouped, ...grouped };
        return mergedGrouped;
    }

    async getTotalBalance(): Promise<TotalBalance> {
        const [
            { data: ethBalance },
            { data: bnbBalance },
            { data: tronBalance },
            { data: solanaBalance },
            { data: suiCoinBalances },
            { data: stellarBalance }
        ] = await Promise.all([
            this._ethereumWallet.getNativeTokenBalance(),
            this._bnbWallet.getNativeTokenBalance(),
            this._tronWallet.getNativeTokenBalance(),
            this._solanaWallet.getNativeTokenBalance(),
            this._suiWallet.getAllCoinBalances(),
            this._stellarWallet.getNativeTokenBalance()
        ]);
        // const { data: ethBalance } = await this._ethereumWallet.getNativeTokenBalance();
        // const { data: bnbBalance } = await this._bnbWallet.getNativeTokenBalance();
        // const { data: tronBalance } = await this._tronWallet.getNativeTokenBalance();
        // const { data: solanaBalance } = await this._solanaWallet.getNativeTokenBalance();
        // const suiCoinBalances = await this._suiWallet.getAllCoinBalances();

        const tonBalance = parseFloat(await this._tonWallet.balanceTon());
        const tonPrice = await tonAPIClient.getRates("native");
        const [
            ethPrice,
            bnbPrice,
            tronPrice,
            solanaPrice,
            stellarPrice
        ] = await coingeckoClient.getCoinPriceByCoinID([
            CoinIds.ETH,
            CoinIds.BNB,
            CoinIds.TRON,
            CoinIds.SOLANA,
            CoinIds.XLM
        ]);
        // Native balances
        const tonUSDBalance = tonPrice.price_usd * (tonBalance ?? 0);
        const ethUSDBalance = ethPrice.price * (ethBalance ?? 0);
        const bnbUSDBalance = bnbPrice.price * (bnbBalance ?? 0);
        const tronUSDBalance = tronPrice.price * (tronBalance ?? 0);
        const solanaUSDBalance = solanaPrice.price * (solanaBalance ?? 0);
        const stellarUSDBalance = stellarPrice.price * (stellarBalance ?? 0);
        const suiAllUSDBalance =
            suiCoinBalances?.reduce((acc, curr) => acc + curr.balanceUSD, 0) ?? 0;

        // imported Tokens
        const importedTokens = await this.getImportedTokens();
        // Jettons
        const savedJettons = importedTokens.TON;
        const tonTokens = await tonAPIClient.getAllJettonsBalances({
            account: this.getAddressInNetwork(CHAINS.TON),
            currencies: ["usd"]
        });
        const allJettonsBalances = getAllJettonsBalancesDTOToTokenBalances(tonTokens); // all jettons on account
        // console.log(allJettonsBalances);
        const combinedJettons = uniqBy([...allJettonsBalances, ...savedJettons], "tokenContract"); // remove duplicates
        // Total
        const totalUSDBalance: number =
            ethUSDBalance +
            tronUSDBalance +
            tonUSDBalance +
            solanaUSDBalance +
            stellarUSDBalance +
            suiAllUSDBalance +
            // balance of all imported tokens
            Object.values(importedTokens)
                .reduce((pv, cv) => [...pv, ...cv], [])
                .reduce((pv, cv) => pv + (cv.balanceUSD ?? 0), 0) +
            combinedJettons.reduce((pv, cv) => pv + (cv.balanceUSD ?? 0), 0);

        return {
            totalUSDBalance: preciseAmount(totalUSDBalance),
            chains: {
                ETH: {
                    nativeToken: {
                        tokenID: "ethereum",
                        tokenSymbol: "ETH",
                        tokenName: "Ethereum",
                        balance: ethBalance ?? 0,
                        balanceUSD: ethUSDBalance,
                        price: ethPrice.price,
                        decimals: 18,
                        tokenIcon:
                            "https://raw.githubusercontent.com/delab-team/manifests-images/main/eth-icon-160x160.png",
                        platform: CHAINS.ETH,
                        isNativeToken: true,
                        change24h: ethPrice.change24h
                    },
                    tokens: importedTokens.ETH
                },
                BNB: {
                    nativeToken: {
                        tokenID: "binancecoin",
                        tokenSymbol: "BNB",
                        tokenName: "BNB",
                        balance: bnbBalance ?? 0,
                        balanceUSD: bnbUSDBalance,
                        price: bnbPrice.price,
                        decimals: 18,
                        tokenIcon:
                            "https://coin-images.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1696501970",
                        platform: CHAINS.BNB,
                        isNativeToken: true,
                        change24h: bnbPrice.change24h
                    },
                    tokens: importedTokens.BNB
                },
                TON: {
                    nativeToken: {
                        tokenID: "ton",
                        tokenSymbol: "TON",
                        tokenName: "Ton",
                        tokenIcon:
                            "https://s2.coinmarketcap.com/static/img/coins/200x200/11419.png",
                        balance: tonBalance,
                        balanceUSD: tonUSDBalance,
                        price: tonPrice.price_usd,
                        platform: CHAINS.TON,
                        isNativeToken: true,
                        change24h: tonPrice.price_change_24h
                    },
                    tokens: combinedJettons
                },
                TRON: {
                    nativeToken: {
                        tokenID: "tron",
                        tokenSymbol: "TRX",
                        tokenName: "TRON",
                        tokenIcon:
                            "https://raw.githubusercontent.com/delab-team/manifests-images/main/trx-icon-160x160.png",
                        balance: tronBalance ?? 0,
                        balanceUSD: tronUSDBalance,
                        price: tronPrice.price,
                        platform: CHAINS.TRON,
                        isNativeToken: true,
                        change24h: tronPrice.change24h
                    },
                    tokens: importedTokens.TRON
                },
                SOLANA: {
                    nativeToken: {
                        tokenID: "solana",
                        tokenSymbol: "SOL",
                        tokenName: "Solana",
                        tokenIcon:
                            "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
                        balance: solanaBalance ?? 0,
                        balanceUSD: solanaUSDBalance,
                        price: solanaPrice.price,
                        platform: CHAINS.SOLANA,
                        isNativeToken: true,
                        change24h: solanaPrice.change24h
                    }
                },
                STELLAR: {
                    nativeToken: {
                        tokenID: "stellar-lumens",
                        tokenSymbol: "XLM",
                        tokenName: "Stellar Lumens",
                        tokenIcon:
                            "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
                        balance: stellarBalance ?? 0,
                        balanceUSD: stellarUSDBalance,
                        price: stellarPrice.price,
                        decimals: 7,
                        platform: CHAINS.STELLAR,
                        isNativeToken: true,
                        change24h: stellarPrice.change24h
                    },
                    tokens: importedTokens.STELLAR ?? []
                },
                SUI: {
                    nativeToken: suiCoinBalances?.find(coin => coin.isNativeToken) ?? {
                        tokenID: "sui",
                        tokenSymbol: "SUI",
                        tokenName: "Sui",
                        tokenIcon:
                            "https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290",
                        balance: 0,
                        balanceUSD: 0,
                        price: 0,
                        platform: CHAINS.SUI,
                        isNativeToken: true,
                        change24h: 0
                    },
                    tokens: suiCoinBalances?.filter(coin => !coin.isNativeToken) ?? []
                }
            }
        };
    }

    async transferToken({
        tokenSelected,
        receiver,
        amount,
        mnemonics,
        memo = ""
    }: TransferTokenDTO): Promise<TransferTokenResponse> {
        try {
            let result: TransferTokenResponse;
            if (tokenSelected.platform === CHAINS.TON) {
                if (tokenSelected.isNativeToken) {
                    const txRes = await this._tonWallet.transferTon({
                        amount: amount,
                        to: receiver,
                        mnemonics,
                        memo
                    });
                    result = {
                        isError: !txRes,
                        data: null
                    };
                } else if (tokenSelected.tokenContract) {
                    const txRes = await this._tonWallet.transferJetton({
                        amount: amount,
                        to: receiver,
                        mnemonics,
                        tokenAddress: tokenSelected.tokenContract,
                        memo
                    });
                    result = {
                        isError: !txRes,
                        data: null
                    };
                } else throw new Error("Invalid Token");
            } else if (tokenSelected.platform === CHAINS.TRON) {
                if (tokenSelected?.isNativeToken) {
                    result = await this._tronWallet.transferNativeToken(
                        receiver,
                        amount,
                        mnemonics,
                        memo
                    );
                } else if (tokenSelected?.tokenContract) {
                    result = await this._tronWallet.transferTokenByContractAddress(
                        receiver,
                        amount,
                        tokenSelected?.tokenContract,
                        mnemonics,
                        memo
                    );
                } else throw new Error("Invalid Token");
            } else if (tokenSelected.platform === CHAINS.SOLANA) {
                if (tokenSelected?.isNativeToken) {
                    result = await this._solanaWallet.transferNativeToken(
                        receiver,
                        amount,
                        mnemonics
                    );
                } else throw new Error("Invalid Token");
            } else if (tokenSelected.platform === CHAINS.SUI) {
                if (tokenSelected?.isNativeToken) {
                    result = await this._suiWallet.transferNativeToken(receiver, amount, mnemonics);
                } else if (tokenSelected?.tokenContract) {
                    result = await this._suiWallet.transferTokenByContractAddress(
                        receiver,
                        amount,
                        tokenSelected?.tokenContract,
                        mnemonics
                    );
                } else throw new Error("Invalid Token");
            } else if (tokenSelected.platform === CHAINS.STELLAR) {
                if (tokenSelected?.isNativeToken) {
                    // For now, Stellar transfers are handled through UI components
                    // This is a placeholder for future implementation
                    throw new Error("Stellar transfers not implemented in this method");
                } else throw new Error("Invalid Token");
            } else if (isEVMChain(tokenSelected.platform)) {
                const wallet = getEVMWalletByChain(this._ethAddress, tokenSelected.platform);
                if (tokenSelected?.isNativeToken)
                    result = await wallet.transferNativeToken(receiver, amount, mnemonics, memo);
                else if (tokenSelected?.tokenContract) {
                    result = await wallet.transferTokenByContractAddress(
                        receiver,
                        amount,
                        tokenSelected?.tokenContract,
                        mnemonics,
                        memo
                    );
                } else throw new Error("Invalid Token");
            } else throw new Error("Invalid Token");
            return result;
        } catch (error) {
            console.error(error);
            return {
                data: null,
                isError: true,
                errorMessage: (error as EthersError).shortMessage ?? (error as EthersError).message
            } as APIResponseFail;
        }
    }

    async getLastTxs(): Promise<BaseTxnParsed[]> {
        const tonTxs = await tonAPIClient.getAccountEvents({
            account: this.getAddressInNetwork(CHAINS.TON),
            limit: 100
        });
        return getAccountEventsDTOToParsedTxn(tonTxs, this.getAddressInNetwork(CHAINS.TON));
    }

    async getLastTxsByToken(token: BaseToken): Promise<BaseTxnParsed[]> {
        try {
            if (token.platform === CHAINS.TON) {
                if (token.isNativeToken) {
                    const tonTxs = await tonAPIClient.getAccountEvents({
                        account: this.getAddressInNetwork(CHAINS.TON),
                        limit: 100
                    });
                    return getAccountEventsDTOToParsedTxn(
                        tonTxs,
                        this.getAddressInNetwork(CHAINS.TON)
                    );
                } else if (token.tokenContract) {
                    const jettonTxs = await tonAPIClient.getTransferJettonHistory({
                        account: this.getAddressInNetwork(CHAINS.TON),
                        jettonId: token.tokenContract ?? "",
                        limit: 500
                    });
                    return getTransferJettonHistoryDTOToParsedTxn(
                        jettonTxs,
                        this.getAddressInNetwork(CHAINS.TON)
                    );
                }
                return [];
            } else if (isEVMChain(token.platform)) {
                const client = getEVMAPIClientByChain(this._ethAddress, token.platform);
                if (token.isNativeToken) {
                    const { data } = await client.getNormalTransactions({
                        offset: 500
                    });
                    if (!data) return [];
                    return parseEVMNativeTxn(
                        data.filter(tx => tx.value !== "0"),
                        client._address.toString(),
                        token.platform
                    );
                } else if (token.tokenContract) {
                    const { data } = await client.getTokenTransactions({
                        offset: 500,
                        contractaddress: token.tokenContract
                    });
                    if (!data) return [];
                    return parseEVMTokenTxn(data, client._address.toString(), token.platform);
                }
                return [];
            } else if (token.platform === CHAINS.TRON) {
                if (token.isNativeToken) {
                    const { data } = await this._tronAPI.getNormalTransactions({});
                    if (!data) return [];
                    return parseTronNativeTxn(data, this._tronAPI._address);
                } else if (token.tokenContract) {
                    const { data } = await this._tronAPI.getTokenTransactions({
                        contractaddress: token.tokenContract
                    });
                    if (!data) return [];
                    return parseTronTokenTxn(data, this._tronAPI._address);
                }
                return [];
            } else return [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async sendNFT({
        nftAddress,
        receiverAddress,
        privateKey,
        memo
    }: {
        receiverAddress: string;
        nftAddress: string;
        privateKey: string;
        memo?: string;
    }) {
        return await this._tonWallet.signMsgNFT(nftAddress, receiverAddress, privateKey, memo);
    }

    async getStateInit({ version }: { version: string }) {
        return await this._tonWallet.getStateInit({ version });
    }

    async signRawMessages({
        messages,
        mnemonic
    }: {
        mnemonic: string;
        messages: SignRawMessage[];
    }) {
        return this._tonWallet.sendRawTrx(mnemonic, this._tonVersion, messages);
    }
}
