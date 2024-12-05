import { TokenBalance } from "@/shared/lib/types";

export interface TransferTokenDTO {
    tokenSelected: TokenBalance;
    receiver: string;
    amount: number;
    memo?: string;
    mnemonics: string;
}
