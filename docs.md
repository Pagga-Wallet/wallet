## Cloud Storage Documentation

### Overview
The wallet implements a storage system using Telegram's CloudStorage, which provides cross-platform data synchronization for users across all their devices. This implementation is crucial for maintaining wallet data consistency regardless of whether the user accesses their wallet from mobile, desktop, or web platforms.

### Technical Specifications of CloudStorage

- Limitations
  - Maximum of 1024 storage items per user
  - Each key must be 1-128 characters long
  - Allowed characters in keys: A-Z, a-z, 0-9, underscore() and dash(-)
  - Each value can contain up to 4096 characters
  - Total storage size is limited to ~1MB per user

### Storage Architecture

#### Account Storage Structure

Due to CloudStorage limitations, we've implemented a distributed storage pattern where each account's data is split into multiple keys:

```javascript
// Example key structure for an account
`${MULTICHAIN_MASTER_PREFIX}ACCOUNT-${id}_${field}`
```

#### Key Components

The storage system is implemented using the TelegramStorage class, which provides methods for saving and retrieving data from the CloudStorage.

1. Account Registry
   - Stores list of all account IDs
   - Key: ACCOUNT_IDS_ARRAY
   - Value: JSON array of account IDs

2. Per-Account Data
   - Each account's data is split into multiple fields:
     - Basic Information:
       - Name
       - Emoji ID
       - Master IV
       - Master Hash
     - Blockchain-specific data for each chain (ETH, TRON, SOLANA, SUI, TON):
       - Public keys
       - Addresses
       -  TON-specific address interfaces (V4, V3R1, V3R2)

### Implementation Details

Account Creation

```javascript
public async saveNewAccount(account: IMultichainAccount): Promise<boolean> {
    // Check if maximum wallet limit is reached
    await this._checkAvailableCreation();
   
    // Update account registry
    const accountIds = await this.getAccountIds();
    await this.save(ACCOUNT_IDS_ARRAY, JSON.stringify([...accountIds, account.id]));
    
    // Save individual account data
    await this.saveAccount(account);
}
```
Data Retrieval

```javascript
public async getAccountData(id: string): Promise<IMultichainAccount> {
    // Fetch all account components using separate keys
    const accountPrefix = this._getAccountPrefix(id);
    
    // Parallel fetching of all account data
    const [masterHash, masterIV, name, /* other fields */] = await Promise.all([
        this.get(accountPrefix + MASTER_HASH_FIELD),
        this.get(accountPrefix + MASTER_IV_FIELD),
        this.get(accountPrefix + NAME_FIELD),
        // ... other field fetches
    ]);
}
```
### Design Considerations

#### Why This Approach?

1. Storage Limitations Management
   - Breaking down account data into smaller chunks ensures we stay within the 4096-character limit per value
   - Allows efficient partial data updates without needing to rewrite entire account data

2. Cross-Platform Compatibility
   - CloudStorage provides built-in synchronization across all Telegram platforms
   - No need for custom synchronization implementation
   -  Instant data availability on all user devices

3. Performance Optimization
   - Parallel data fetching/storing using Promise.all
   - Selective data updates - only modified fields are updated
   - Efficient account deletion by key prefix filtering

####  Security Considerations

1. Sensitive data (private keys) are never stored in CloudStorage
2. Master encryption data (IV, Hash) are stored separately
3. Each account's data is isolated using unique prefixes

### Usage Limitations

- Maximum number of user wallets is enforced (MAX_USER_WALLETS constant)
- Token imports are limited to 20 per chain
- Account IDs are sequential but with duplicate prevention

### Error Handling
The implementation includes comprehensive error handling:

1. Account existence verification
2. Storage limit checks
3. Data integrity validation
4. Proper cleanup during account deletion

### Cross-Platform Benefits

- Seamless synchronization across all Telegram platforms
- Consistent user experience across devices
- No additional backend infrastructure required
- Automatic conflict resolution handled by Telegram's CloudStorage

This storage implementation provides a robust, secure, and efficient way to manage wallet data while working within Telegram's CloudStorage constraints and providing excellent cross-platform compatibility.

## Cryptography Implementation Documentation

### Overview

The wallet implements a sophisticated cryptographic system that supports both BIP39 and TON-style mnemonics, providing compatibility with major wallet providers like TrustWallet and Tonkeeper. This multi-chain non-custodial wallet ensures secure key derivation and storage across different blockchain networks.

### Mnemonic Support and Key Derivation

#### Dual Mnemonic System

The wallet supports two types of mnemonics:

1. BIP39 Mnemonics
   - Compatible with TrustWallet and other standard wallets
   - Uses standard BIP39 derivation paths
   - Follows industry-standard seed generation

2.  TON Mnemonics
   - Compatible with Tonkeeper and other TON wallets
   - Uses TON-specific key derivation
   - Supports TON's unique address formats

#### Mnemonic Detection and Processing

```javascript
public async importWallet(mnemonic: string): Promise<IUserWalletsData> {
    const isTONMnemonic = await tonMnemonicValidate(mnemonic.split(" "));
    const isBIP39Mnemonic = bip39.validateMnemonic(mnemonic);
    
    if (!isTONMnemonic && !isBIP39Mnemonic) {
        throw new Error("Invalid mnemonic");
    }
    
    // Generate wallets for all supported chains
    const wallets = await Promise.all([
        this.tonWalletFromUnknownMnemonic(mnemonic),
        this.ethereumHDWalletFromUnknownMnemonic(mnemonic),
        this.tronWalletFromUnknownMnemonic(mnemonic),
        this.solanaWalletFromUnknownMnemonic(mnemonic),
        this.suiWalletFromUnknownMnemonic(mnemonic)
    ]);
    
    return {
        mainMnemonic: mnemonic,
        // ... wallet data
    };
}
```
### Security Architecture

#### Secure Storage Implementation

The wallet never stores raw mnemonics or private keys in CloudStorage. Instead, it implements a secure encryption system:

1. Encryption Process (KeyToHash)
```javascript
public KeyToHash(mnemonics: string, password: string) {
    // Generate random initialization vector
    const initializationVector = Buffer.from(ethers.randomBytes(16)).toString("hex");
    
    // Create encryption key from password
    const secret = Buffer.from(password, "utf8").toString("hex");
    const key = initializationVector + secret + globalSecret;
    
    // Encrypt mnemonic
    const hashFromKey = crypto.AES.encrypt(mnemonics, key).toString();
    
    return {
        iv: initializationVector,
        hashFromKey
    };
}
```
2. Decryption Process (HashToKey)

```javascript
public HashToKey(
    password: string,
    initializationVector: string,
    hash: string
): string | undefined {
    try {
        const secret = Buffer.from(password, "utf8").toString("hex");
        const key = initializationVector + secret + globalSecret;
        return crypto.AES.decrypt(hash, key).toString(crypto.enc.Utf8);
    } catch (error) {
        return undefined;
    }
}
```

#### Storage Strategy

Encrypted Storage:
- Mnemonics are encrypted using user's PIN code
- Only encrypted hashes are stored in CloudStorage
- Initialization vectors are stored separately

Public Data Storage:
- Wallet addresses
- Public keys
- Account metadata

### Multi-Chain Implementation
#### Supported Blockchains

1. TON Network
   - Supports V4, V3R2, and V3R1 wallet versions
   - Derives TON-specific addresses and keys

2. Ethereum
   - Standard ETH address derivation
   - Compatible with EVM-based networks

3. Tron
   - TRC20 wallet support
   - Tron-specific address formatting

4. Solana
   - ED25519 key derivation
   - Solana address formatting

5. SUI
   -  SUI-specific key derivation
   - Native address format support

### Key Management Flow

Import/Creation:
   - Mnemonic validation and type detection
   - Multi-chain wallet derivation
   - Encryption of sensitive data

Transaction Signing:
   - PIN code verification
   - Mnemonic decryption
   - Private key derivation
   - Transaction signing
   - Immediate memory cleanup

Regular Usage:
   - Access to public addresses
   - Balance checking
   - Transaction history
   - No access to private keys without PIN

### Security Considerations

#### Private Key Access
Private keys are only derived during transaction signing
Keys are never stored in persistent storage
Memory is cleared after transaction signing

#### Encryption
AES encryption for mnemonic storage
Unique initialization vectors per encryption
PIN code-based key derivation

#### Storage Security
No sensitive data in CloudStorage
Only encrypted hashes stored
Public data stored in clear text
Cross-platform synchronization of encrypted data

### Best Practices
   - Regular PIN code validation
   - Immediate cleanup of sensitive data from memory
   - Encrypted backup support
   - Secure key derivation paths
   - Multiple mnemonic format support

This implementation ensures secure, non-custodial wallet functionality while maintaining compatibility with major blockchain networks and wallet providers. The system's architecture prioritizes security while providing a seamless user experience across all supported platforms.




