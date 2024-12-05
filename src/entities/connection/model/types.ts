import { ConnectItemReply } from "@tonconnect/protocol";
import { TonConnectBridgeType } from "@/shared/lib/connect/models";

export interface IConnection {
    accId: string;
    clientSessionId: string;
    iconUrl: string;
    name: string;
    date: string;
    replyItems: ConnectItemReply[];
    sessionKeyPair: {
        publicKey: string;
        secretKey: string;
    };
    type: TonConnectBridgeType.Remote;
}

export interface IConnectionWithWalletName extends IConnection {
    walletFullName: string;
}
