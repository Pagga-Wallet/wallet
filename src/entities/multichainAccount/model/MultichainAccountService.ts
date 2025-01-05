import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { multichainAccountStore } from "@/entities/multichainAccount";
// eslint-disable-next-line boundaries/element-types
import { NFTItem } from "@/entities/nft";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { cryptographyController } from "@/shared/lib";
import { registerService } from "@/shared/lib/redux";
import {
    BaseToken,
    CHAINS,
    IMultichainAccount,
    IUserWalletsData,
    TokenBalance,
    TON_ADDRESS_INTERFACES,
    TotalBalance
} from "@/shared/lib/types/multichainAccount";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { MultichainAccount } from "./MultichainAccount";

export interface ICreateAccountResult extends IUserWalletsData {
    id: string;
    isNew: boolean;
}

interface IGetAccNFTsResult {
    items: NFTItem[];
}

interface ISaveAccount {
    pincode: string;
    walletData: ICreateAccountResult;
}

type UpdateWalletPayload = {
    emojiId?: string;
    name?: string;
};

interface IUpdateWallet {
    id: string;
    payload: UpdateWalletPayload;
}

interface IGetLastTxsByToken {
    items: BaseTxnParsed[];
}

export const multichainAccountAPI = createApi({
    reducerPath: "multichainAccountApi",
    baseQuery: fakeBaseQuery<{
        message: string;
    }>(),
    tagTypes: [
        "Balance",
        "Account",
        "AccountList",
        "SavedERC20Tokens",
        "verifyPIN",
        "NFT",
        "TonVersion",
        "TxList"
    ],
    endpoints: builder => ({
        fetchTotalBalance: builder.query<TotalBalance, void>({
            queryFn: async (_, api) => {
                try {
                    const state = api.getState() as any;
                    const data = await new MultichainAccount(
                        state.multichainAccount.account,
                        state.multichainAccount.tonVersion
                    ).getTotalBalance();
                    return { data: data };
                } catch (error) {
                    return {
                        error: {
                            message: (error as Error).message
                        }
                    };
                }
            },
            providesTags: result => (result ? [{ type: "Balance" }] : [])
        }),
        loadAccount: builder.query<IMultichainAccount | null, string>({
            queryFn: async accId => {
                try {
                    const account = await telegramStorage.getAccountData(accId);
                    return {
                        data: {
                            ...account,
                            id: accId
                        }
                    };
                } catch (error) {
                    return {
                        error: {
                            message: (error as Error).message
                        }
                    };
                }
            },
            async onQueryStarted(accId, { dispatch, queryFulfilled }) {
                try {
                    // console.log('fetch account')
                    await queryFulfilled;
                    dispatch(
                        multichainAccountAPI.util.invalidateTags([
                            { type: "Balance" },
                            { type: "NFT" }
                        ])
                    );
                    await telegramStorage.setLastUsedAccountId(accId);
                } catch (error) {
                    console.error("Error load account.", error);
                }
            },
            providesTags: (result, _, arg) => (result ? [{ type: "Account", id: arg }] : [])
        }),
        createAccount: builder.mutation<ICreateAccountResult, void>({
            queryFn: async () => {
                const id = await telegramStorage.getNextAccountId();
                const newWallet = await cryptographyController.createMultichainWallet();
                const isNew = await telegramStorage.isWalletAvailable().then(res => !res);
                await telegramStorage.setLastUsedAccountId(id);
                return {
                    data: {
                        ...newWallet,
                        id,
                        isNew
                    }
                };
            }
        }),
        saveAccount: builder.mutation<IMultichainAccount, ISaveAccount>({
            queryFn: async ({ walletData, pincode }) => {
                try {
                    // console.log("walletData", walletData);
                    const mainHash = cryptographyController.KeyToHash(
                        walletData.mainMnemonic,
                        pincode
                    );
                    if (!mainHash?.iv || !mainHash?.hashFromKey) {
                        // TODO описать ошибку
                        return {
                            error: {
                                message: ""
                            }
                        };
                    }
                    // Сохраняем аккаунт
                    const newAccount: IMultichainAccount = {
                        id: walletData.id,
                        masterIV: mainHash?.iv,
                        emojiId: "0",
                        masterHash: mainHash?.hashFromKey,
                        multiwallet: {
                            ETH: {
                                publicKey: walletData.eth.publicKey,
                                address: walletData.eth.address
                            },
                            TON: {
                                publicKey: walletData.ton.publicKey,
                                address: {
                                    V4: walletData.ton.addressV4,
                                    V3R1: walletData.ton.addressV3R1,
                                    V3R2: walletData.ton.addressV3R2
                                }
                            },
                            TRON: {
                                publicKey: walletData.tron.publicKey,
                                address: walletData.tron.address
                            },
                            SOLANA: {
                                address: walletData.solana.address
                            }
                        }
                    };
                    await telegramStorage.saveNewAccount(newAccount);
                    return {
                        data: {
                            ...newAccount
                        }
                    };
                } catch (e) {
                    return {
                        error: {
                            message: (e as Error).message
                        }
                    };
                }
            },
            async onQueryStarted({ walletData }, { queryFulfilled, dispatch }) {
                const patchResult = dispatch(
                    multichainAccountAPI.util.updateQueryData(
                        "fetchAccounts",
                        undefined,
                        accounts => {
                            accounts.push({
                                id: walletData.id,
                                name: "",
                                emojiId: "0"
                            });
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),
        getAllNFTs: builder.query<IGetAccNFTsResult, void>({
            queryFn: async (_, { getState }) => {
                // TODO type root global state or slice
                const state = getState() as any;
                const items = await new MultichainAccount(
                    state.multichainAccount.account,
                    state.multichainAccount.tonVersion
                ).getAllNFTs();
                return {
                    data: {
                        items
                    }
                };
            },
            providesTags: result =>
                result
                    ? [
                          ...result.items.map(({ address, chain }) => ({
                              type: "NFT" as const,
                              id: `${chain}_${address}`
                          })),
                          "NFT"
                      ]
                    : ["NFT"]
        }),
        getLastTxsByToken: builder.query<IGetLastTxsByToken, TokenBalance | BaseToken>({
            queryFn: async (token, { getState }) => {
                // TODO type root global state or slice
                const state = getState() as any;
                const items = await new MultichainAccount(
                    state.multichainAccount.account,
                    state.multichainAccount.tonVersion
                ).getLastTxsByToken(token);
                return {
                    data: {
                        items
                    }
                };
            },
            providesTags: ["TxList"]
        }),
        getLastTxs: builder.query<IGetLastTxsByToken, void>({
            queryFn: async (_, { getState }) => {
                // TODO type root global state or slice
                const state = getState() as any;
                const items = await new MultichainAccount(
                    state.multichainAccount.account,
                    state.multichainAccount.tonVersion
                ).getLastTxs();
                return {
                    data: {
                        items
                    }
                };
            },
            providesTags: ["TxList"]
        }),
        getImportedTokens: builder.query<Record<CHAINS, string[]> | undefined, void>({
            queryFn: async () => {
                return { data: await telegramStorage.getImportedTokens() };
            },
            providesTags: result => (result ? [{ type: "SavedERC20Tokens" }] : [])
        }),
        deleteImportedToken: builder.mutation<
            { success: boolean },
            { token: string; chain: CHAINS }
        >({
            queryFn: async ({ token, chain }) => {
                const success = await telegramStorage.deleteImportedToken(token, chain);
                return {
                    data: { success }
                };
            },
            invalidatesTags: result =>
                result?.success ? [{ type: "SavedERC20Tokens" }, { type: "Balance" }] : []
        }),
        importToken: builder.mutation<{ success: boolean }, { token: string; chain: CHAINS }>({
            queryFn: async ({ token, chain }) => {
                const success = await telegramStorage.saveImportedToken(token, chain);
                return {
                    data: { success }
                };
            },
            invalidatesTags: result =>
                result?.success ? [{ type: "SavedERC20Tokens" }, { type: "Balance" }] : []
        }),
        importAccount: builder.mutation<ICreateAccountResult, string[]>({
            queryFn: async mnemonic => {
                const id = await telegramStorage.getNextAccountId();
                const wallet = await cryptographyController.importWallet(mnemonic.join(" "));
                const isNew = await telegramStorage.isWalletAvailable().then(res => !res);
                return {
                    data: {
                        ...wallet,
                        id,
                        isNew
                    }
                };
            }
        }),
        fetchAccounts: builder.query<
            {
                id: string;
                name: string;
                emojiId: string;
            }[],
            void
        >({
            queryFn: async () => {
                const accounts = await telegramStorage.getAccounts();
                return {
                    data: accounts
                };
            },
            providesTags: result =>
                result
                    ? [...result.map(({ id }) => ({ type: "Account" as const, id })), "Account"]
                    : ["Account"]
        }),
        fetchAccount: builder.query<IMultichainAccount, string>({
            queryFn: async id => {
                const account = await telegramStorage.getAccountData(id);
                return {
                    data: account
                };
            },
            providesTags: result => (result ? [{ type: "Account", id: result.id }] : [])
        }),
        updateAccount: builder.mutation<{ success: boolean }, IUpdateWallet>({
            queryFn: async ({ id, payload }) => {
                try {
                    const account = await telegramStorage.getAccountData(id);
                    await telegramStorage.saveAccount({
                        ...account,
                        ...payload
                    });
                    return {
                        data: {
                            success: true
                        }
                    };
                } catch (error) {
                    return {
                        error: {
                            message: (error as Error).message
                        }
                    };
                }
            },
            invalidatesTags: (result, error, { id }) =>
                result?.success ? [{ type: "Account", id }] : [],
            async onQueryStarted({ id, payload }, { dispatch, queryFulfilled, getState }) {
                const patchFetchAccount = dispatch(
                    multichainAccountAPI.util.updateQueryData("fetchAccount", id, account => {
                        Object.assign(account, payload);
                    })
                );
                const previousState = (getState() as any).multichainAccount.account;
                if (previousState.id === id) {
                    dispatch(multichainAccountStore.actions.updateAccount(payload));
                }
                try {
                    await queryFulfilled;
                } catch {
                    patchFetchAccount.undo();
                    if (previousState.id === id) {
                        dispatch(multichainAccountStore.actions.updateAccount(previousState));
                    }
                }
            }
        }),
        deleteAccount: builder.mutation<{ prevAccId: string | null }, string>({
            queryFn: async id => {
                const accIds = await telegramStorage.getAccountIds();
                if (!accIds.includes(id)) {
                    return {
                        error: {
                            message: "Account not found."
                        }
                    };
                }
                const prevAccId = accIds.filter(accId => accId !== id).at(-1);
                await telegramStorage.deleteAccount(id);
                const lastAccId = await telegramStorage.getLastUsedAccountId();
                if (lastAccId === id) {
                    await telegramStorage.setLastUsedAccountId(prevAccId);
                }
                return {
                    data: {
                        prevAccId: prevAccId || null
                    }
                };
            },
            invalidatesTags: ["Account"]
        }),
        verifyPIN: builder.query<boolean, string>({
            queryFn: async (pin, { getState }) => {
                const account = (getState() as any).multichainAccount.account;
                const result = cryptographyController.HashToKey(
                    pin,
                    account.masterIV,
                    account.masterHash
                );
                return {
                    data: !!result
                };
            },
            providesTags: ["verifyPIN"]
        }),
        changePIN: builder.mutation<
            { id: string; iv: string; hashFromKey: string }[],
            {
                newPIN: string;
                oldPIN: string;
            }
        >({
            queryFn: async ({ newPIN, oldPIN }) => {
                try {
                    const ids = await telegramStorage.getAccountIds();
                    const accountsData = await Promise.all(
                        ids.map(id => telegramStorage.getAccountData(id))
                    );

                    const result = accountsData.map(acc => {
                        return {
                            id: acc.id,
                            mnemonic: cryptographyController.HashToKey(
                                oldPIN,
                                acc.masterIV,
                                acc.masterHash
                            )!
                        };
                    });

                    const updateData = result.map(({ id, mnemonic }) => {
                        const { iv, hashFromKey } = cryptographyController.KeyToHash(
                            mnemonic,
                            newPIN
                        )!;
                        return {
                            id,
                            iv,
                            hashFromKey
                        };
                    });

                    await Promise.all(
                        updateData.map(masterData =>
                            telegramStorage.updateMasterData(masterData.id, {
                                masterIV: masterData.iv,
                                masterHash: masterData.hashFromKey
                            })
                        )
                    );

                    return {
                        data: updateData
                    };
                } catch (e) {
                    return {
                        error: {
                            message: (e as Error).message
                        }
                    };
                }
            },
            async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data: updateData } = await queryFulfilled;
                    const previousState = (getState() as any).multichainAccount.account;
                    const currentAcc = updateData.find(acc => previousState.id === acc.id);
                    if (!currentAcc) {
                        throw new Error("Account not found.");
                    }
                    dispatch(
                        multichainAccountStore.actions.updateAccount({
                            masterIV: currentAcc.iv,
                            masterHash: currentAcc.hashFromKey
                        })
                    );
                } catch (e) {
                    console.error(e);
                }
            },
            invalidatesTags: ["verifyPIN"]
        }),
        sendNFT: builder.mutation({
            queryFn: async ({ address, receiverAddress, pin, memo }, { getState }) => {
                try {
                    const state = getState() as any;
                    const account = state.multichainAccount.account;
                    const privateKey = cryptographyController.HashToKey(
                        pin,
                        account.masterIV,
                        account.masterHash
                    );
                    if (!privateKey) {
                        throw new Error("Invalid PIN");
                    }
                    await new MultichainAccount(
                        account,
                        state.multichainAccount.tonVersion
                    ).sendNFT({
                        nftAddress: address,
                        receiverAddress,
                        privateKey,
                        memo
                    });
                    return {
                        data: {}
                    };
                } catch (e) {
                    return {
                        error: {
                            message: (e as Error).message
                        }
                    };
                }
            }
        }),
        getOldAccount: builder.query<{ hash: string; iv: string } | null, void>({
            queryFn: async () => {
                const hash = await telegramStorage.getOld("hash");
                const iv = await telegramStorage.getOld("iv");

                if (!hash || !iv) {
                    return {
                        data: null
                    };
                }

                return {
                    data: {
                        hash,
                        iv
                    }
                };
            }
        }),
        renewAccount: builder.mutation<any, { iv: string; pin: string; hash: string }>({
            queryFn: async ({ pin, hash, iv }) => {
                const mnemonic = cryptographyController.HashToKey(pin, iv, hash);

                if (!mnemonic) {
                    return {
                        error: {
                            message: "Invalid PIN"
                        }
                    };
                }

                const id = await telegramStorage.getNextAccountId();
                const wallet = await cryptographyController.importWallet(mnemonic);

                return {
                    data: {
                        ...wallet,
                        id
                    }
                };
            }
        }),
        finishOnboarding: builder.mutation<{ success: true }, void>({
            queryFn: async () => {
                await telegramStorage.setIsOnboarded("true");
                return {
                    data: {
                        success: true
                    }
                };
            }
        }),
        loadTonVersion: builder.query<TON_ADDRESS_INTERFACES, void>({
            queryFn: async () => {
                const version = await telegramStorage.getTonVersion();
                return {
                    data: (version || TON_ADDRESS_INTERFACES.V4) as TON_ADDRESS_INTERFACES
                };
            },
            providesTags: ["TonVersion"]
        }),
        switchTonVersion: builder.mutation<{ success: true }, TON_ADDRESS_INTERFACES>({
            queryFn: async version => {
                await telegramStorage.setTonVersion(version);
                return {
                    data: {
                        success: true
                    }
                };
            },
            async onQueryStarted(version, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success) {
                        dispatch(multichainAccountStore.actions.setTonVersion(version));
                        dispatch(
                            multichainAccountAPI.util.invalidateTags([
                                { type: "Balance" },
                                { type: "NFT" },
                                { type: "TxList" },
                                { type: "TonVersion" }
                            ])
                        );
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        })
    })
});

registerService(multichainAccountAPI);
export const {
    useCreateAccountMutation,
    useDeleteAccountMutation,
    useDeleteImportedTokenMutation,
    useFetchAccountQuery,
    useFetchAccountsQuery,
    useFetchTotalBalanceQuery,
    useGetAllNFTsQuery,
    useGetLastTxsByTokenQuery,
    useGetImportedTokensQuery,
    useImportAccountMutation,
    useLazyLoadAccountQuery,
    useLoadAccountQuery,
    useSaveAccountMutation,
    useImportTokenMutation,
    useUpdateAccountMutation,
    useLazyVerifyPINQuery,
    useChangePINMutation,
    useSendNFTMutation,
    useLazyGetOldAccountQuery,
    useGetOldAccountQuery,
    useRenewAccountMutation,
    useFinishOnboardingMutation,
    useGetLastTxsQuery,
    useSwitchTonVersionMutation,
    useLoadTonVersionQuery
} = multichainAccountAPI;
