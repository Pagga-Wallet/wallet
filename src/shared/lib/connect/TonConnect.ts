import {
    AppRequest,
    ConnectEvent,
    ConnectRequest,
    CONNECT_EVENT_ERROR_CODES,
    RpcMethod,
    SEND_TRANSACTION_ERROR_CODES,
    SessionCrypto,
    WalletResponse,
    KeyPair,
} from "@tonconnect/protocol";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { TelegramStorage, telegramStorage } from "@/shared/api/telegramStorage";
import { MIN_PROTOCOL_VERSION, tonConnectDeviceInfo } from "./config";
import { ConnectEventError } from "./ConnectEventError";
import { ConnectReplyBuilder } from "./ConnectReplyBuilder";
import { TCEventID } from "./EventID";
import {
    DAppManifest,
    IConnectedAppConnection,
    IConnectedAppConnectionRemote,
    SendTonConnectTransactionProps,
    SignRawParams,
    TonConnectBridgeType,
    TonConnectModalProps,
    TonConnectModalResponse,
} from "./models";
import { SendTransactionError } from "./SendTransactionError";

function getTimeSec() {
    return Math.floor(Date.now() / 1000);
}

export class TonConnectService {
    private _storage: TelegramStorage;
    constructor() {
        this._storage = telegramStorage;
    }

    checkProtocolVersionCapability(protocolVersion: number) {
        if (typeof protocolVersion !== "number" || protocolVersion < MIN_PROTOCOL_VERSION) {
            throw new ConnectEventError(
                CONNECT_EVENT_ERROR_CODES.BAD_REQUEST_ERROR,
                `Protocol version ${String(protocolVersion)} is not supported by the wallet app`
            );
        }
    }

    verifyConnectRequest(request: ConnectRequest) {
        if (!(request && request.manifestUrl && request.items?.length)) {
            throw new ConnectEventError(
                CONNECT_EVENT_ERROR_CODES.BAD_REQUEST_ERROR,
                "Wrong request data"
            );
        }
    }

    async fallbackGetManifest(request: ConnectRequest): Promise<DAppManifest> {
        try {
            // const response = await axios.get(
            //     `${import.meta.env.VITE_PROXY_URL}/manifest`,
            //     {
            //         params: { url: request.manifestUrl },
            //     }
            // );
            // const manifest = response.data;

            const manifest = {
                url: "t.me/privateton_bot/start",
                name: "Test app",
                iconUrl: "https://media.istockphoto.com/id/1053093832/vector/grunge-red-rubber-preview-word-with-star-icon-round-rubber-seal-stamp-on-white-background.jpg?s=612x612&w=0&k=20&c=fR0YRF0CiA9BZ8ukLXN59RFwPbtLVcr4Nl7LeuIJlXk="
            };

            const isValid =
                manifest &&
                typeof manifest.url === "string" &&
                typeof manifest.name === "string" &&
                typeof manifest.iconUrl === "string";

            if (!isValid) {
                throw new ConnectEventError(
                    CONNECT_EVENT_ERROR_CODES.MANIFEST_CONTENT_ERROR,
                    "Manifest is not valid"
                );
            }

            return manifest;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new ConnectEventError(
                    CONNECT_EVENT_ERROR_CODES.MANIFEST_NOT_FOUND_ERROR,
                    `Can't get ${request.manifestUrl}`
                );
            }

            throw error;
        }
    }

    async getManifest(request: ConnectRequest): Promise<DAppManifest> {
        try {
            const { data } = await axios.get<DAppManifest>(request.manifestUrl);
            const isValid =
                data &&
                typeof data.url === "string" &&
                typeof data.name === "string" &&
                typeof data.iconUrl === "string";

            if (!isValid) {
                throw new ConnectEventError(
                    CONNECT_EVENT_ERROR_CODES.MANIFEST_CONTENT_ERROR,
                    "Manifest is not valid"
                );
            }

            return data;
        } catch (e) {
            return await this.fallbackGetManifest(request);
        }
    }

    async connect(
        protocolVersion: number,
        request: ConnectRequest,
        setShowConnectModal: (el: boolean) => void,
        setConnectModalProps: (el: any) => void,
        accId: string,
        addConnection: (connection: IConnectedAppConnection) => Promise<void>,
        sessionCrypto?: SessionCrypto,
        clientSessionId?: string,
        webViewUrl?: string
    ): Promise<ConnectEvent> {
        try {
            this.checkProtocolVersionCapability(protocolVersion);

            this.verifyConnectRequest(request);

            const manifest = await this.getManifest(request);

            const SetPropsTonconnectModalState = (props: TonConnectModalProps) => {
                setShowConnectModal(true);
                setConnectModalProps(props);
            };

            try {
                const { replyItems } = await new Promise<TonConnectModalResponse>(
                    (resolve, reject) => {
                        SetPropsTonconnectModalState({
                            protocolVersion: protocolVersion as 2,
                            manifest,
                            replyBuilder: new ConnectReplyBuilder(request, manifest),
                            requestPromise: { resolve, reject },
                            hideImmediately: !!webViewUrl,
                        });
                    }
                );

                await addConnection({
                    name: manifest.name,
                    iconUrl: manifest.iconUrl,
                    accId,
                    date: new Date().toISOString(),
                    type: TonConnectBridgeType.Remote,
                    sessionKeyPair: sessionCrypto!.stringifyKeypair(),
                    clientSessionId: clientSessionId!,
                    replyItems,
                });

                return {
                    id: TCEventID.getId(),
                    event: "connect",
                    payload: {
                        items: replyItems,
                        device: tonConnectDeviceInfo,
                    },
                };
            } catch {
                throw new ConnectEventError(
                    CONNECT_EVENT_ERROR_CODES.USER_REJECTS_ERROR,
                    "Wallet declined the request"
                );
            }
        } catch (error) {
            if (error instanceof ConnectEventError) {
                return error;
            }

            return new ConnectEventError(
                CONNECT_EVENT_ERROR_CODES.UNKNOWN_ERROR,
                "initial connect error"
            );
        }
    }

    public async saveConnections(connections: IConnectedAppConnection[]): Promise<boolean> {
        return await this._storage.saveConnections(connections);
    }

    public async loadConnections(): Promise<{ connections: IConnectedAppConnection[] }> {
        const connections = await this._storage.getConnections();
        console.log({ connections });
        return { connections };
    }

    async handleRequestFromRemoteBridge<T extends RpcMethod>(
        request: AppRequest<T>,
        clientSessionId: string,
        connection: IConnectedAppConnection,
        onTransactionConfirm: (props: SendTonConnectTransactionProps) => void,
        setTonconnectTransactionProps: React.Dispatch<
            React.SetStateAction<SendTonConnectTransactionProps | undefined>
        >
    ): Promise<WalletResponse<T>> {
        return this.handleRequest(
            request,
            connection,
            onTransactionConfirm,
            setTonconnectTransactionProps
        );
    }

    private async handleRequest<T extends RpcMethod>(
        request: AppRequest<T>,
        connection: IConnectedAppConnection | null,
        setShowSendModal: (props: SendTonConnectTransactionProps) => void,
        setTonconnectTransactionProps: React.Dispatch<
            React.SetStateAction<SendTonConnectTransactionProps | undefined>
        >
    ): Promise<WalletResponse<T>> {
        if (!connection) {
            return {
                error: {
                    code: SEND_TRANSACTION_ERROR_CODES.UNKNOWN_APP_ERROR,
                    message: "Unknown app",
                },
                id: request.id,
            };
        }

        if (request.method === "sendTransaction") {
            console.log("sendTransaction handle");
            return this.sendTransaction(
                request,
                connection,
                setShowSendModal,
                setTonconnectTransactionProps
            );
        }

        if (request.method === "disconnect") {
            return this.handleDisconnectRequest(request, connection);
        }

        return {
            error: {
                code: SEND_TRANSACTION_ERROR_CODES.BAD_REQUEST_ERROR,
                message: `Method "${request.method}" does not supported by the wallet app`,
            },
            id: request.id,
        };
    }

    async handleDisconnectRequest(
        request: AppRequest<"disconnect">,
        connection: IConnectedAppConnection
    ): Promise<WalletResponse<"disconnect">> {
        const storageConnections = await this.loadConnections();
        if (connection.type === TonConnectBridgeType.Remote) {
            const remoteConnections = storageConnections.connections.filter(
                (conn) => conn.type === TonConnectBridgeType.Remote
            ) as IConnectedAppConnectionRemote[];
            const filteredConnections = remoteConnections.filter(
                (conn) => conn.clientSessionId !== connection.clientSessionId
            );
            const saveRes = await this.saveConnections(filteredConnections);
            console.log("save in storage res after disconnect", saveRes);
        }

        return {
            id: request.id,
            result: {},
        };
    }

    async sendTransaction(
        request: AppRequest<"sendTransaction">,
        connection: IConnectedAppConnection,
        setShowSendModal: (props: SendTonConnectTransactionProps) => void,
        setTonconnectTransactionProps: React.Dispatch<
            React.SetStateAction<SendTonConnectTransactionProps | undefined>
        >
    ): Promise<WalletResponse<"sendTransaction">> {
        console.log("connection", connection);
        try {
            const params = JSON.parse(request.params[0]) as SignRawParams;

            const isValidRequest =
                params &&
                typeof params.valid_until === "number" &&
                Array.isArray(params.messages) &&
                params.messages.every((msg) => !!msg.address && !!msg.amount);

            if (!isValidRequest || !params.valid_until) {
                throw new SendTransactionError(
                    request.id,
                    SEND_TRANSACTION_ERROR_CODES.BAD_REQUEST_ERROR,
                    "Bad request"
                );
            }

            const { valid_until, messages } = params;

            console.log("tonconnect trans messages", messages);

            if (valid_until < getTimeSec()) {
                throw new SendTransactionError(
                    request.id,
                    SEND_TRANSACTION_ERROR_CODES.BAD_REQUEST_ERROR,
                    "Request timed out"
                );
            }

            const SetPropsTonconnectTransaction = (props: SendTonConnectTransactionProps) => {
                console.log("SetPropsTonconnectTransaction", props);

                setTonconnectTransactionProps(props);
                setShowSendModal(props);
            };

            console.log("start try");
            console.log("messages from tonconnect transaction", messages);
            const res = await new Promise<string>((resolve, reject) => {
                SetPropsTonconnectTransaction({
                    address: messages[0].address,
                    amount: messages[0].amount,
                    messages,
                    valid_until,
                    requestPromise: { resolve, reject },
                    request,
                    connection,
                });
            });

            return {
                result: res,
                id: request.id,
            };
        } catch (error) {
            if (error instanceof SendTransactionError) {
                return error;
            }

            return new SendTransactionError(
                request.id,
                SEND_TRANSACTION_ERROR_CODES.UNKNOWN_ERROR,
                "UNKNOWN_ERROR"
            );
        }
    }
}

export const TonConnect = new TonConnectService();
