/* eslint-disable @typescript-eslint/no-unused-vars */
 
import {
    AppRequest,
    ConnectItemReply,
    KeyPair,
    SEND_TRANSACTION_ERROR_CODES,
} from "@tonconnect/protocol";
import { ConnectReplyBuilder } from "./ConnectReplyBuilder";
import { SendTransactionError } from "./SendTransactionError";

export interface IConnectQrQuery {
    version: string;
    request: string;
    id: string;
    strategy?: ReturnStrategy | null;
}

export type ReturnStrategy = "back" | "none" | string;

export interface DAppManifest {
    url: string;
    name: string;
    iconUrl: string;
    termsOfUseUrl?: string;
    privacyPolicyUrl?: string;
}

export interface TonConnectModalResponse {
    address: string;
    replyItems: ConnectItemReply[];
    notificationsEnabled: boolean;
}

export type TonConnectModalProps = {
    protocolVersion: 2;
    manifest: DAppManifest;
    replyBuilder: ConnectReplyBuilder;
    requestPromise: {
        resolve: (response: TonConnectModalResponse) => void;
        reject: () => void;
    };
    hideImmediately: boolean;
};

export enum TonConnectBridgeType {
    Remote = "remote",
    Injected = "injected",
}

export interface IConnectedAppConnectionRemote {
    name: string;
    iconUrl: string;
    accId: string;
    date: string;
    sessionKeyPair: KeyPair;
    clientSessionId: string;
    type: TonConnectBridgeType.Remote;
    replyItems: ConnectItemReply[];
}

export type IConnectedAppConnection = IConnectedAppConnectionRemote;

export interface SignRawMessage {
    address: string;
    amount: string; // (decimal string): number of nanocoins to send.
    payload?: string; // (string base64, optional): raw one-cell BoC encoded in Base64.
    stateInit?: string; // (string base64, optional): raw once-cell BoC encoded in Base64.
}

export type SignRawParams = {
    source?: string;
    valid_until?: number;
    messages: SignRawMessage[];
};

export type SendTonConnectTransactionProps = {
    address: string;
    amount: string; // (decimal string): number of nanocoins to send.
    messages: SignRawMessage[];
    valid_until?: number;
    requestPromise: {
        resolve: (response: string) => void;
        reject: (error: SendTransactionError) => void;
    };
    request: AppRequest<"sendTransaction">;
    connection: {
        name: string;
        iconUrl: string;
    };
};
