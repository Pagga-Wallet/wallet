interface AccountAddress {
    address: string;
    name?: string;
    is_scam: boolean;
    icon?: string;
    is_wallet: boolean;
}

interface Action {
    type:
        | "TonTransfer"
        | "JettonTransfer"
        | "JettonBurn"
        | "JettonMint"
        | "NftItemTransfer"
        | "ContractDeploy"
        | "Subscribe"
        | "UnSubscribe"
        | "AuctionBid"
        | "NftPurchase"
        | "DepositStake"
        | "WithdrawStake"
        | "WithdrawStakeRequest"
        | "JettonSwap"
        | "SmartContractExec"
        | "ElectionsRecoverStake"
        | "ElectionsDepositStake"
        | "DomainRenew"
        | "Unknown";
    status: "ok" | "failed";
    TonTransfer?: TonTransferAction;
    ContractDeploy?: ContractDeployAction;
    JettonTransfer?: JettonTransferAction;
    JettonBurn?: JettonBurnAction;
    JettonMint?: JettonMintAction;
    NftItemTransfer?: NftItemTransferAction;
    Subscribe?: SubscribeAction;
    UnSubscribe?: UnSubscribeAction;
    AuctionBid?: AuctionBidAction;
    NftPurchase?: NftPurchaseAction;
    DepositStake?: DepositStakeAction;
    WithdrawStake?: WithdrawStakeAction;
    WithdrawStakeRequest?: WithdrawStakeRequestAction;
    ElectionsDepositStake?: ElectionsDepositStakeAction;
    ElectionsRecoverStake?: ElectionsRecoverStakeAction;
    JettonSwap?: JettonSwapAction;
    SmartContractExec?: SmartContractAction;
    DomainRenew?: DomainRenewAction;
    simple_preview: ActionSimplePreview;
}

interface TonTransferAction {
    sender: AccountAddress;
    recipient: AccountAddress;
    amount: number;
    comment?: string;
    encrypted_comment?: EncryptedComment;
    refund: Refund;
}

interface EncryptedComment {
    encryption_type: string;
    cipher_text: string;
}

interface Refund {
    type: "DNS.ton" | "DNS.tg" | "GetGems";
    origin: string;
}

interface ContractDeployAction {
    address: string;
    interfaces: string[];
}

interface JettonTransferAction {
    sender?: AccountAddress;
    recipient?: AccountAddress;
    senders_wallet: string;
    recipients_wallet: string;
    amount: number;
    comment?: string;
    encrypted_comment?: EncryptedComment;
    refund?: Refund;
    jetton: JettonPreview;
}

interface JettonPreview {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: JettonVerificationType;
}

type JettonVerificationType = "whitelist" | "blacklist" | "none";

interface JettonBurnAction {
    sender: AccountAddress;
    senders_wallet: string;
    amount: string;
    jetton: JettonPreview;
}

interface JettonMintAction {
    recipient: AccountAddress;
    recipients_wallet: string;
    amount: string;
    jetton: JettonPreview;
}

interface NftItemTransferAction {
    sender?: AccountAddress;
    recipient?: AccountAddress;
    nft: string;
    comment?: string;
    encrypted_comment?: EncryptedComment;
    payload?: string;
    refund?: Refund;
}

interface SubscribeAction {
    subscriber: AccountAddress;
    subscription: string;
    beneficiary: AccountAddress;
    amount: bigint;
    initial: boolean;
}

interface UnSubscribeAction {
    subscriber: AccountAddress;
    subscription: string;
    beneficiary: AccountAddress;
}

interface AuctionBidAction {
    auction_type: "DNS.ton" | "DNS.tg" | "NUMBER.tg" | "getgems";
    amount: Price;
    nft?: NftItem;
    bidder: AccountAddress;
    auction: AccountAddress;
}

interface Price {
    value: string;
    token_name: string;
}

interface NftItem {
    address: string;
    index: bigint;
    owner?: AccountAddress;
    collection?: {
        address: string;
        name: string;
        description: string;
    };
    verified: boolean;
    metadata: any;
    sale?: Sale;
    previews?: ImagePreview[];
    dns?: string;
    approved_by: NftApprovedBy;
}

type NftApprovedBy = ["getgems" | "tonkeeper" | "ton.diamonds"];

interface Sale {
    address: string;
    market: AccountAddress;
    owner?: AccountAddress;
    price: Price;
}

interface ImagePreview {
    resolution: string;
    url: string;
}

interface NftPurchaseAction {
    auction_type: "DNS.tg" | "getgems" | "basic";
    amount: Price;
    nft: NftItem;
    seller: AccountAddress;
    buyer: AccountAddress;
}

interface DepositStakeAction {
    amount: bigint;
    staker: AccountAddress;
    pool: AccountAddress;
    implementation: PoolImplementationType;
}

type PoolImplementationType = "whales" | "tf" | "liquidTf";

interface WithdrawStakeAction {
    amount: bigint;
    staker: AccountAddress;
    pool: AccountAddress;
    implementation: PoolImplementationType;
}

interface WithdrawStakeRequestAction {
    amount: bigint;
    staker: AccountAddress;
    pool: AccountAddress;
    implementation: PoolImplementationType;
}

interface ElectionsDepositStakeAction {
    amount: bigint;
    staker: AccountAddress;
}

interface ElectionsRecoverStakeAction {
    amount: bigint;
    staker: AccountAddress;
}

interface JettonSwapAction {
    dex: "stonfi" | "dedust" | "megatonfi";
    amount_in: string;
    amount_out: string;
    ton_in?: bigint;
    ton_out?: bigint;
    user_wallet: AccountAddress;
    router: AccountAddress;
    jetton_master_in?: JettonPreview;
    jetton_master_out?: JettonPreview;
}

interface SmartContractAction {
    executor: AccountAddress;
    contract: AccountAddress;
    ton_attached?: bigint;
    operation: string;
    payload?: string;
    refund?: Refund;
}

interface DomainRenewAction {
    domain: string;
    contract_address: string;
    renewer: AccountAddress;
}

interface ActionSimplePreview {
    name: string;
    description: string;
    action_image?: string;
    value?: string;
    value_image?: string;
    accounts: AccountAddress[];
}

export interface AccountEvent {
    event_id: string;
    account: AccountAddress;
    timestamp: number;
    actions: Action[];
    is_scam: boolean;
    lt: bigint;
    in_progress: boolean;
    extra: bigint;
}

export interface GetTransferJettonHistoryDTO {
    events: AccountEvent[];
    next_form: bigint;
}
