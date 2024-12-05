export const MAX_USER_WALLETS = 10;
// Префиксы должны оканчиваться на "_"
export const LEGACY_UNSAFE_PREFIX = "WALLET_";
export const DEFAULT_PREFIX = "WALLET-MULTICHAIN_";
export const MULTICHAIN_MASTER_PREFIX = DEFAULT_PREFIX + "MULTICHAIN-MASTER_";
export const ACCOUNT_IDS_ARRAY = DEFAULT_PREFIX + "ACCOUNT-IDS";
export const MASTER_IV_FIELD = "masterIV";
export const MASTER_HASH_FIELD = "masterHash";
export const NAME_FIELD = "name";
export const EMOJI_ID_FIELD = "emojiId";
export const PUBLIC_KEY_FIELD = "publicKey";
export const ADDRESS_FIELD = "address";
export const ERC20_TOKENS_FIELD = DEFAULT_PREFIX + "SAVED-ERC20-TOKENS";
export const BEP20_TOKENS_FIELD = DEFAULT_PREFIX + "SAVED-BEP20-TOKENS";
export const LAST_USED_ACC_ID = DEFAULT_PREFIX + "lastAccId";

export const CONNECTIONS_FIELD = DEFAULT_PREFIX + "CONNECTIONS";
export const CONNECTION_PREFIX = DEFAULT_PREFIX + "CONNECTION_";

export const IS_ONBOARDED_FIELD = DEFAULT_PREFIX + "isOnboarded";
export const USE_BIOMETRY_FIELD = DEFAULT_PREFIX + "useBiometry";

export const TON_VERSION_FIELD = DEFAULT_PREFIX + "tonVersion";
