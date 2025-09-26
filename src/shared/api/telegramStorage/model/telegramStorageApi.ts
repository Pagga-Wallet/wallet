import { cloudStorage } from "@telegram-apps/sdk-react";
import {
    CHAINS,
    IMultichainAccount,
    IMultiwallet,
    TON_ADDRESS_INTERFACES
} from "@/shared/lib/types/multichainAccount";
import {
    ACCOUNT_IDS_ARRAY,
    ADDRESS_FIELD,
    EMOJI_ID_FIELD,
    LAST_USED_ACC_ID,
    LEGACY_UNSAFE_PREFIX,
    MASTER_HASH_FIELD,
    MASTER_IV_FIELD,
    MAX_USER_WALLETS,
    MULTICHAIN_MASTER_PREFIX,
    NAME_FIELD,
    PUBLIC_KEY_FIELD,
    CONNECTIONS_FIELD,
    CONNECTION_PREFIX,
    IS_ONBOARDED_FIELD,
    USE_BIOMETRY_FIELD,
    TON_VERSION_FIELD
} from "../lib/consts";
import { getTokensField } from "../lib/helpers";

export class TelegramStorage {
    // === BASIC METHODS ===

    private async save(key: string, data: string): Promise<boolean> {
        await cloudStorage.setItem(key, data);
        return true;
    }

    private async get(key: string): Promise<string>;
    private async get(keys: string[]): Promise<Record<string, string>>;
    private async get(key: string | string[]) {
        if (Array.isArray(key)) {
            return await cloudStorage.getItem(key);
        }
        return await cloudStorage.getItem(key);
    }

    private async delete(key: string): Promise<boolean> {
        await cloudStorage.deleteItem(key);
        return true;
    }

    private async getKeys(): Promise<string[]> {
        try {
            return await cloudStorage.getKeys();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // === WALLET STORAGE METHODS ===

    public async getAccountIds(): Promise<string[]> {
        const accountIds = await this.get(ACCOUNT_IDS_ARRAY);
        const parsed = JSON.parse(accountIds || "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed;
    }

    public async getNextAccountId(): Promise<string> {
        const accountIds = await this.getAccountIds();
        if (accountIds.length < 1) return "0";
        const lastId = Number(accountIds.at(-1));
        let newId = lastId + 1;
        // в случае, если существует дубликат
        while (accountIds.includes(String(newId))) {
            newId++;
        }
        return String(newId);
    }

    private _getAccountPrefix(id: number | string): string {
        return `${MULTICHAIN_MASTER_PREFIX}ACCOUNT-${id}_`;
    }

    private async _checkAvailableCreation() {
        const accountIds = await this.getAccountIds();
        if (accountIds.length >= MAX_USER_WALLETS) {
            throw new Error("Max accounts limit reached");
        }
    }

    public async isWalletAvailable(): Promise<boolean> {
        const accountIds = await this.getAccountIds();
        return accountIds.length > 0;
    }

    public async getLastUsedAccountId(): Promise<string | undefined> {
        const last = await this.get(LAST_USED_ACC_ID);
        const ids = await this.getAccountIds();
        if (!last || !ids.includes(last)) return ids[ids.length - 1];
        return last;
    }

    public async setLastUsedAccountId(id: string | null | undefined): Promise<boolean> {
        if (!id) {
            return await this.delete(LAST_USED_ACC_ID);
        }
        return await this.save(LAST_USED_ACC_ID, id);
    }

    public async saveAccount(account: IMultichainAccount) {
        const { id } = account;

        const accountPrefix = this._getAccountPrefix(id);
        if (account.name) {
            await this.save(accountPrefix + NAME_FIELD, account.name);
        }

        if (account.emojiId) {
            await this.save(accountPrefix + EMOJI_ID_FIELD, account.emojiId);
        }

        await Promise.all([
            // MASTER DATA
            this.save(accountPrefix + MASTER_IV_FIELD, account.masterIV),
            this.save(accountPrefix + MASTER_HASH_FIELD, account.masterHash),
            // ETH DATA
            this.save(
                `${accountPrefix}${CHAINS.ETH}_${PUBLIC_KEY_FIELD}`,
                account.multiwallet.ETH.publicKey
            ),
            this.save(
                `${accountPrefix}${CHAINS.ETH}_${ADDRESS_FIELD}`,
                account.multiwallet.ETH.address
            ),
            // TRON DATA
            this.save(
                `${accountPrefix}${CHAINS.TRON}_${PUBLIC_KEY_FIELD}`,
                account.multiwallet.TRON.publicKey
            ),
            this.save(
                `${accountPrefix}${CHAINS.TRON}_${ADDRESS_FIELD}`,
                account.multiwallet.TRON.address
            ),
            // SOLANA DATA
            this.save(
                `${accountPrefix}${CHAINS.SOLANA}_${ADDRESS_FIELD}`,
                account.multiwallet.SOLANA.address
            ),
            // SOLANA DATA
            this.save(
                `${accountPrefix}${CHAINS.SUI}_${ADDRESS_FIELD}`,
                account.multiwallet.SUI.address
            ),
            // STELLAR DATA
            this.save(
                `${accountPrefix}${CHAINS.STELLAR}_${PUBLIC_KEY_FIELD}`,
                account.multiwallet.STELLAR.publicKey
            ),
            this.save(
                `${accountPrefix}${CHAINS.STELLAR}_${ADDRESS_FIELD}`,
                account.multiwallet.STELLAR.address
            ),
            // TON DATA
            this.save(
                `${accountPrefix}${CHAINS.TON}_${PUBLIC_KEY_FIELD}`,
                account.multiwallet.TON.publicKey
            ),
            this.save(
                `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V4}_${ADDRESS_FIELD}`,
                account.multiwallet.TON.address.V4
            ),
            this.save(
                `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V3R1}_${ADDRESS_FIELD}`,
                account.multiwallet.TON.address.V3R1
            ),
            this.save(
                `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V3R2}_${ADDRESS_FIELD}`,
                account.multiwallet.TON.address.V3R2
            )
        ]);
    }

    public async updateMasterData(
        id: string,
        {
            masterIV,
            masterHash
        }: {
            masterIV: string;
            masterHash: string;
        }
    ) {
        const accountPrefix = this._getAccountPrefix(id);
        await Promise.all([
            this.save(accountPrefix + MASTER_IV_FIELD, masterIV),
            this.save(accountPrefix + MASTER_HASH_FIELD, masterHash)
        ]);
    }

    public async saveNewAccount(account: IMultichainAccount): Promise<boolean> {
        try {
            await this._checkAvailableCreation();
            const accountIds = await this.getAccountIds();
            // Обновляем массив аккаунтов
            await this.save(ACCOUNT_IDS_ARRAY, JSON.stringify([...accountIds, account.id]));
            await this.saveAccount(account);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async getAccounts() {
        const accountIds = await this.getAccountIds();
        return await Promise.all(
            accountIds.map(async accountId => {
                const accountPrefix = this._getAccountPrefix(accountId);
                const name = await this.get(accountPrefix + NAME_FIELD);
                const emojiId = await this.get(accountPrefix + EMOJI_ID_FIELD);
                return {
                    id: accountId,
                    name,
                    emojiId
                };
            })
        );
    }

    public async getAccountData(id: string): Promise<IMultichainAccount> {
        const accountIds = await this.getAccountIds();
        if (!accountIds.includes(id)) {
            throw new Error("Account with this id does not exist");
        }

        const account = {
            id,
            multiwallet: {
                ETH: {},
                TRON: {},
                SOLANA: {},
                STELLAR: {},
                SUI: {},
                TON: {
                    address: {}
                }
            }
        } as IMultichainAccount;
        const accountPrefix = this._getAccountPrefix(id);

        // MASTER DATA
        account.masterHash = (await this.get(accountPrefix + MASTER_HASH_FIELD))!;
        account.masterIV = (await this.get(accountPrefix + MASTER_IV_FIELD))!;
        account.name = await this.get(accountPrefix + NAME_FIELD);
        account.emojiId = await this.get(accountPrefix + EMOJI_ID_FIELD);
        // ETH DATA
        account.multiwallet.ETH.address = (await this.get(
            `${accountPrefix}${CHAINS.ETH}_${ADDRESS_FIELD}`
        ))!;
        account.multiwallet.ETH.publicKey = (await this.get(
            `${accountPrefix}${CHAINS.ETH}_${PUBLIC_KEY_FIELD}`
        ))!;
        // TRON DATA
        account.multiwallet.TRON.address = (await this.get(
            `${accountPrefix}${CHAINS.TRON}_${ADDRESS_FIELD}`
        ))!;
        account.multiwallet.TRON.publicKey = (await this.get(
            `${accountPrefix}${CHAINS.TRON}_${PUBLIC_KEY_FIELD}`
        ))!;
        // SOLANA DATA
        account.multiwallet.SOLANA.address = (await this.get(
            `${accountPrefix}${CHAINS.SOLANA}_${ADDRESS_FIELD}`
        ))!;
        // STELLAR DATA
        account.multiwallet.STELLAR.address = (await this.get(
            `${accountPrefix}${CHAINS.STELLAR}_${ADDRESS_FIELD}`
        ))!;
        account.multiwallet.STELLAR.publicKey = (await this.get(
            `${accountPrefix}${CHAINS.STELLAR}_${PUBLIC_KEY_FIELD}`
        ))!;
        // SUI DATA
        account.multiwallet.SUI.address = (await this.get(
            `${accountPrefix}${CHAINS.SUI}_${ADDRESS_FIELD}`
        ))!;
        // TON DATA
        account.multiwallet.TON.publicKey = (await this.get(
            `${accountPrefix}${CHAINS.TON}_${PUBLIC_KEY_FIELD}`
        ))!;
        account.multiwallet.TON.address.V4 = (await this.get(
            `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V4}_${ADDRESS_FIELD}`
        ))!;
        account.multiwallet.TON.address.V3R1 = (await this.get(
            `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V3R1}_${ADDRESS_FIELD}`
        ))!;
        account.multiwallet.TON.address.V3R2 = (await this.get(
            `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V3R2}_${ADDRESS_FIELD}`
        ))!;
        return account;
    }

    public async getAllAccounts(): Promise<{ [key: string]: object }> {
        const accountIds = await this.getAccountIds();
        const result: { [key: string]: object } = {};

        for (const account of accountIds) {
            const accountPrefix = this._getAccountPrefix(account);
            result[account] = {
                ETH: await this.get(`${accountPrefix}${CHAINS.ETH}_${ADDRESS_FIELD}`),
                TRON: await this.get(`${accountPrefix}${CHAINS.TRON}_${ADDRESS_FIELD}`),
                TON: await this.get(
                    `${accountPrefix}${CHAINS.TON}_${TON_ADDRESS_INTERFACES.V4}_${ADDRESS_FIELD}`
                ),
                SOLANA: await this.get(`${accountPrefix}${CHAINS.SOLANA}_${ADDRESS_FIELD}`),
                STELLAR: await this.get(`${accountPrefix}${CHAINS.STELLAR}_${ADDRESS_FIELD}`),
                SUI: await this.get(`${accountPrefix}${CHAINS.SUI}_${ADDRESS_FIELD}`)
            };
        }

        return result;
    }

    public async deleteAccount(id: string): Promise<boolean> {
        try {
            // Удаляем акк из списка
            const accountIds = await this.getAccountIds();
            if (accountIds.includes(id)) {
                const newArray = accountIds.filter(el => el !== id);
                await this.save(ACCOUNT_IDS_ARRAY, JSON.stringify(newArray));
            }
            // Удаляем все ассоциированные поля
            const keys = await this.getKeys();
            const lastAccId = await this.getLastUsedAccountId();
            if (lastAccId === id) {
                await this.delete(LAST_USED_ACC_ID);
            }
            const res = await Promise.all(
                keys
                    .filter((key: string) => key.startsWith(this._getAccountPrefix(id)))
                    .map(key => this.delete(key))
            );
            return res.every(Boolean);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async deleteAllAccounts(): Promise<boolean> {
        try {
            const accountIds = await this.getAccountIds();
            await Promise.all(accountIds.map(id => this.deleteAccount(id)));
            return true;
        } catch (error) {
            console.error();
            return false;
        }
    }

    public async UNSAFE_resetAllStorage(): Promise<boolean> {
        try {
            const keys = await this.getKeys();
            const res = await Promise.all(keys.map(key => this.delete(key)));
            return res.every(Boolean);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async UNSAFE_resetOldPrefixedData(): Promise<void> {
        try {
            const keys = await this.getKeys();
            keys.forEach(
                key =>
                    (key.startsWith(LEGACY_UNSAFE_PREFIX) || key === "lastAccId") &&
                    this.delete(key)
            );
        } catch (error) {
            console.error(error);
        }
    }

    // === TOKENS ===

    public async getImportedTokens(): Promise<Record<CHAINS, string[]>> {
        const chains = Object.values(CHAINS) as CHAINS[];
        const entries: Array<[CHAINS, string[]]> = await Promise.all(
            chains.map(
                async (chain): Promise<[CHAINS, string[]]> => {
                    const data = await this.get(getTokensField(chain));
                    return [chain, JSON.parse(data || "[]")];
                }
            )
        );
        const result = Object.fromEntries(entries) as Record<CHAINS, string[]>;
        return result;
    }

    public async saveImportedToken(contractAddress: string, chain: CHAINS): Promise<boolean> {
        const tokens = (await this.getImportedTokens())[chain];
        if (tokens.length >= 20) return false;
        return await this.save(getTokensField(chain), JSON.stringify([...tokens, contractAddress]));
    }

    public async deleteImportedToken(contractAddress: string, chain: CHAINS): Promise<boolean> {
        const tokens = (await this.getImportedTokens())[chain];
        return await this.save(
            getTokensField(chain),
            JSON.stringify(tokens.filter(str => str !== contractAddress))
        );
    }

    // === Connected apps ===
    public async saveConnections(connections: any[]) {
        const connectionMeta = connections.length;
        await this.save(CONNECTIONS_FIELD, connectionMeta.toString());
        const res = await Promise.all(
            connections.map((connection, index) =>
                this.save(`${CONNECTION_PREFIX}${index}`, JSON.stringify(connection))
            )
        );
        return res.every(Boolean);
    }

    public async getConnections() {
        const connectionsMeta = await this.get(CONNECTIONS_FIELD);
        const connectionsKeys = Array.from(
            { length: parseInt(connectionsMeta) },
            (_, i) => `${CONNECTION_PREFIX}${i}`
        );
        const connectionsRecord = await this.get(connectionsKeys);

        return Object.entries(connectionsRecord)
            .filter(([, value]) => value)
            .map(([key, value]) => ({
                key: key.replace(CONNECTION_PREFIX, ""),
                ...(value ? JSON.parse(value) : {})
            }));
    }

    public async removeConnection(key: string) {
        await this.delete(`${CONNECTION_PREFIX}${key}`);
        const connectionsMeta = await this.get(CONNECTIONS_FIELD);
        const totalConnections = parseInt(connectionsMeta);

        if (parseInt(key) === totalConnections - 1) {
            await this.save(CONNECTIONS_FIELD, (totalConnections - 1).toString());
            return true;
        }

        const lastConnectionKey = `${CONNECTION_PREFIX}${totalConnections - 1}`;
        const lastConnectionValue = await this.get(lastConnectionKey);
        if (lastConnectionValue) {
            await this.save(`${CONNECTION_PREFIX}${key}`, lastConnectionValue);
        }
        await this.delete(lastConnectionKey);
        await this.save(CONNECTIONS_FIELD, (totalConnections - 1).toString());
        return true;
    }

    public async getOld(key: string) {
        return await this.get(`wallet-${key}`);
    }

    public async getIsOnboarded() {
        return await this.get(IS_ONBOARDED_FIELD);
    }

    public async setIsOnboarded(value: string) {
        return await this.save(IS_ONBOARDED_FIELD, value);
    }

    public async getUseBiometry() {
        return await this.get(USE_BIOMETRY_FIELD);
    }

    public async setUseBiometry(value: string) {
        return await this.save(USE_BIOMETRY_FIELD, value);
    }

    public async setTonVersion(value: TON_ADDRESS_INTERFACES) {
        return await this.save(TON_VERSION_FIELD, value);
    }

    public async getTonVersion() {
        return await this.get(TON_VERSION_FIELD);
    }
}

export const telegramStorage = new TelegramStorage();
