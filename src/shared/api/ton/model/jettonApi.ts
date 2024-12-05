import { VaultNative, SwapParams, SwapStep, JettonWallet } from "@dedust/sdk";
import { Address, Builder, Cell, toNano } from "@ton/ton";
import { IBuildSwapJettonToTonMessage, IBuildSwapMessage, TransferOptions } from "../lib/types";

const WALLET_OP = {
    burn_query: 0x3a3b4252,
    transfer_query: 0xf8a7ea5,
    bouncable_transfer_query: 0x3a81b46,
};

class TokenWallet {
    private static newQueryId(): number {
        return ~~(Date.now() / 1000);
    }

    public static buildTransferMessage(options: TransferOptions): Cell {
        const {
            queryId = this.newQueryId(),
            tokenAmount,
            to,
            responseAddress,
            fwdAmount = toNano(0.01),
            // fwdBody = new Builder().cell()
        } = options;

        const op = WALLET_OP.transfer_query;

        // transfer_query or bouncable_transfer_query
        const body = new Builder()
            .storeUint(op, 32) // op
            .storeUint(queryId, 64) // query_id
            .storeCoins(tokenAmount) // token_amount
            .storeAddress(to) // to_address
            .storeAddress(responseAddress) // response_address
            .storeBit(0) // custom_payload:(Maybe ^Cell)
            .storeCoins(fwdAmount); // fwd_amount

        const fwdBody = options.comment
            ? new Builder()
                  .storeUint(0, 32)
                  .storeStringRefTail(options.comment ?? "")
                  .endCell()
            : new Builder().endCell();

        if (body.bits + fwdBody.bits.length > 1023) {
            body.storeBit(1).storeRef(fwdBody);
        } else {
            body.storeBit(0).storeSlice(fwdBody.asSlice());
        }

        return body.asCell();
    }

    public static buildNFTTransferMessage(
        addressTo: string,
        addressUser: string,
        commentPayload?: string
    ): Cell {
        // transfer_query or bouncable_transfer_query
        const queryId = this.newQueryId();
        const body = new Builder()
            .storeUint(0x5fcc3d14, 32)
            .storeUint(queryId || 0, 64)
            .storeAddress(Address.parse(addressTo)) // new_owner_address
            .storeAddress(Address.parse(addressUser)) // excessesAddress
            .storeBit(false)
            .storeCoins(1n);

        const fwdBody = commentPayload
            ? new Builder()
                  .storeUint(0, 32)
                  .storeStringRefTail(commentPayload ?? "")
                  .endCell()
            : new Builder().endCell();

        if (body.bits + fwdBody.bits.length > 1023) {
            body.storeBit(1).storeRef(fwdBody);
        } else {
            body.storeBit(0).storeSlice(fwdBody.asSlice());
        }

        return body.asCell();
    }

    protected static packSwapStep({ poolAddress, limit, next }: SwapStep): Cell {
        const res = new Builder()
            .storeAddress(poolAddress)
            .storeUint(0, 1) // reserved
            .storeCoins(limit ?? 0n)
            .storeMaybeRef(next ? this.packSwapStep(next) : null)
            .endCell();

        return res;
    }

    protected static packSwapParams({
        deadline,
        recipientAddress,
        referralAddress,
        fulfillPayload,
        rejectPayload,
    }: SwapParams): Cell {
        const res = new Builder()
            .storeUint(deadline ?? 0, 32)
            .storeAddress(recipientAddress ?? null)
            .storeAddress(referralAddress ?? null)
            .storeMaybeRef(fulfillPayload)
            .storeMaybeRef(rejectPayload)
            .endCell();

        return res;
    }

    public static buildSwapMessageTonToJetton({
        amount,
        poolAddress,
        queryId,
        limit,
        swapParams,
        next,
    }: IBuildSwapMessage): Cell {
        const body = new Builder()
            .storeUint(VaultNative.SWAP, 32)
            .storeUint(queryId ?? 0, 64)
            .storeCoins(amount)
            .storeAddress(poolAddress)
            .storeUint(0, 1)
            .storeCoins(limit ?? 0)
            .storeMaybeRef(next ? this.packSwapStep(next) : null)
            .storeRef(this.packSwapParams(swapParams ?? {}))
            .endCell();

        return body;
    }

    public static buildSwapMessageJettonWallet({
        amount,
        queryId,
        destination,
        responseAddress,
        customPayload,
        forwardAmount,
        forwardPayload,
    }: IBuildSwapJettonToTonMessage): Cell {
        const body = new Builder()
            .storeUint(JettonWallet.TRANSFER, 32)
            .storeUint(queryId ?? 0, 64)
            .storeCoins(amount)
            .storeAddress(destination)
            .storeAddress(responseAddress)
            .storeMaybeRef(customPayload)
            .storeCoins(forwardAmount ?? 0)
            .storeMaybeRef(forwardPayload)
            .endCell();

        return body;
    }
}

export { TokenWallet };
