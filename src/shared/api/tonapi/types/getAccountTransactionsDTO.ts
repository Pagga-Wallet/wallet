import { Cell } from "@ton/core";

interface AccountAddress {
    address: string;
    name?: string;
    is_scam: boolean;
    is_wallet: boolean;
}

interface StateInit {
    boc: string;
}

interface ComputePhase {
    skipped: boolean;
    skip_reason?: "cskip_no_state" | "cskip_bad_state" | "cskip_no_gas";
    success?: boolean;
    gas_fees?: number;
    gas_used?: number;
    vm_steps?: number;
    extit_code?: number;
}

interface Message {
    created_lt: number;
    ihr_disabled: boolean;
    bounce: boolean;
    bounced: boolean;
    value: number;
    fwd_fee: number;
    ihr_fee: number;
    destination?: AccountAddress;
    source?: AccountAddress;
    import_fee: number;
    created_at: number;
    op_code: string;
    init?: StateInit;
    raw_body?: Cell;
    decoded_op_name?: string;
    decoded_body?: any;
}

interface StoragePhase {
    fees_collected: number;
    fees_due?: number;
    status_change: "acst_unchanged" | "acst_frozen" | "acst_deleted";
}

interface CreditPhase {
    fees_collected: number;
    credit: number;
}

interface ActionPhase {
    success: boolean;
    total_actions: number;
    skipped_actions: number;
    fwd_fees: number;
    total_fees: number;
}

interface Transaction {
    hash: string;
    lt: number;
    account: AccountAddress;
    success: boolean;
    utime: number;
    orig_status: "nonexist" | "uninit" | "active" | "frozen";
    end_status: "nonexist" | "uninit" | "active" | "frozen";
    total_fees: number;
    transaction_type:
        | "TransOrd"
        | "TransTickTock"
        | "TransSplitPrepare"
        | "TransSplitInstall"
        | "TransMergePrepare"
        | "TransMergeInstall"
        | "TransStorage";
    state_update_old: string;
    state_update_new: string;
    in_msg: Message;
    out_msgs?: Message[];
    block: string;
    prev_trans_hash?: string;
    prev_trans_lt?: number;
    compute_phase?: ComputePhase;
    storage_phase?: StoragePhase;
    credit_phase?: CreditPhase;
    action_phase?: ActionPhase;
    bounce_phase?: "TrPhaseBounceNegfunds" | "TrPhaseBounceNofunds" | "TrPhaseBounceOk";
    aborted?: boolean;
    destroyed?: boolean;
}

export interface GetAccountTransactionDTO {
    transactions: Transaction[];
}
