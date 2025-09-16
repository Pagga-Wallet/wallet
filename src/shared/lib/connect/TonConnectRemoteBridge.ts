import {
    AppRequest,
    Base64,
    ConnectEvent,
    ConnectRequest,
    DisconnectEvent,
    hexToByteArray,
    RpcMethod,
    SEND_TRANSACTION_ERROR_CODES,
    SessionCrypto,
    WalletResponse,
} from "@tonconnect/protocol";
import { debounce } from "lodash";
import React, { Dispatch, SetStateAction } from "react";
import { telegramStorage } from "@/shared/api/telegramStorage";
import {
    IConnectedAppConnection,
    IConnectedAppConnectionRemote,
    IConnectQrQuery,
    ReturnStrategy,
    SendTonConnectTransactionProps,
    TonConnectBridgeType,
    TonConnectModalProps,
} from "./models";
import { TonConnect } from "./TonConnect";

function isObject(value: any): value is object {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

class TonConnectRemoteBridgeService {
    private _storage: any;

    private readonly storeKey = "ton-connect-http-bridge-lastEventId";

    private readonly bridgeUrl = `${
        import.meta.env.VITE_BRIDGE_URL
    }/bridge`;

    private readonly defaultTtl = 300;

    private eventSource: EventSource | null = null;

    private connections: IConnectedAppConnectionRemote[] = [];

    private activeRequests: { [from: string]: AppRequest<RpcMethod> } = {};

    private onTransactionConfirm: ((props: SendTonConnectTransactionProps) => void) | undefined;

    private setTonconnectTransactionProps:
        | React.Dispatch<React.SetStateAction<SendTonConnectTransactionProps | undefined>>
        | undefined;

    private setConnectedApps: Dispatch<SetStateAction<IConnectedAppConnection[]>> | undefined;

    private connectedApps: IConnectedAppConnection[] | undefined;
    // private origin: DeeplinkOrigin | null = null

    // private origin: DeeplinkOrigin | null = null

    constructor() {
        this._storage = telegramStorage;
    }

    private returnStrategy: ReturnStrategy = "none";

    private setReturnStrategy(returnStrategy: ReturnStrategy) {
        if (returnStrategy) {
            this.returnStrategy = returnStrategy;
        }
    }

    public async send<T extends RpcMethod>(
        response: WalletResponse<T> | ConnectEvent | DisconnectEvent,
        sessionCrypto: SessionCrypto,
        clientSessionId: string,
        ttl?: number
    ): Promise<void> {
        try {
            const url = `${this.bridgeUrl}/message?client_id=${
                sessionCrypto.sessionId
            }&to=${clientSessionId}&ttl=${ttl || this.defaultTtl}`;

            const encodedResponse = sessionCrypto.encrypt(
                JSON.stringify(response),
                hexToByteArray(clientSessionId)
            );

            await fetch(url, {
                body: Base64.encode(encodedResponse),
                method: "POST",
            });
        } catch (e) {
            console.log("send fail", e);
        }
    }

    private redirectIfNeeded() {
        console.log("returnStrategy", this.returnStrategy);
        if (this.returnStrategy === "back") {
            window.Telegram.WebApp.close();
        } else if (
            this.returnStrategy.startsWith(
                "tg://" || this.returnStrategy.startsWith("https://t.me")
            )
        ) {
            window.Telegram.WebApp.openTelegramLink(this.returnStrategy);
        } else if (this.returnStrategy !== "none" && this.returnStrategy.startsWith("https://")) {
            window.Telegram.WebApp.openLink(this.returnStrategy);
        }

        this.returnStrategy = "none";
    }

    async handleConnectDeeplink(
        query: IConnectQrQuery,
        setShowConnectModal: (el: boolean) => void,
        setConnectModalProps: (el: TonConnectModalProps) => void,
        accId: string,
        addConnection: (connection: IConnectedAppConnection) => Promise<void>
    ) {
        try {
            if (query.strategy) {
                this.setReturnStrategy(query.strategy);
            }

            const protocolVersion = Number(query.version);
            const clientSessionId = query.id;

            let request: ConnectRequest;

            try {
                request = JSON.parse(
                    decodeURIComponent(query.request.replace(/--/g, "%"))
                ) as ConnectRequest;
                
                if (!isObject(request)) {
                    request = JSON.parse(query.request) as ConnectRequest;
                }
            } catch (error) {
                request = query.request as any;
            }

            const sessionCrypto = new SessionCrypto();

            const response = await TonConnect.connect(
                protocolVersion,
                request,
                setShowConnectModal,
                setConnectModalProps,
                accId,
                addConnection,
                sessionCrypto,
                clientSessionId
            );

            console.log("response", response);

            await this.send(response, sessionCrypto, clientSessionId);

            const manifest = await TonConnect.getManifest(request);

            if (manifest.name === "DeSim" || manifest.name === "DeVPN") {
                if (window.Telegram.WebApp.platform !== "tdesktop") {
                    window.Telegram.WebApp.close();
                }
            }

            this.redirectIfNeeded();
        } catch (err) {
            console.log("handleConnectDeeplink error", err);
        }
    }

    async open({
        connectedApps,
        connections,
        onTransactionConfirm,
        setTonconnectTransactionProps,
        setConnectedApps,
    }: {
        connections: IConnectedAppConnection[];
        onTransactionConfirm: (props: SendTonConnectTransactionProps) => void;
        setTonconnectTransactionProps: React.Dispatch<
            React.SetStateAction<SendTonConnectTransactionProps | undefined>
        >;
        setConnectedApps: Dispatch<SetStateAction<IConnectedAppConnection[]>>;
        connectedApps: IConnectedAppConnection[];
    }) {
        this.close();

        this.connections = connections.filter(
            (item) => item.type === TonConnectBridgeType.Remote
        ) as IConnectedAppConnectionRemote[];

        this.onTransactionConfirm = onTransactionConfirm;
        this.setTonconnectTransactionProps = setTonconnectTransactionProps;
        this.setConnectedApps = setConnectedApps;
        this.connectedApps = connectedApps;

        if (this.connections.length === 0) {
            return;
        }

        const walletSessionIds = this.connections
            .map((item) => new SessionCrypto(item.sessionKeyPair).sessionId)
            .join(",");

        let url = `${this.bridgeUrl}/events?client_id=${walletSessionIds}`;

        const lastEventId = await this.getLastEventId();

        if (lastEventId) {
            url += `&last_event_id=${lastEventId}`;
        }

        console.log("sse connect", url);

        this.eventSource = new EventSource(url);

        this.eventSource.addEventListener("message", debounce(this.handleMessage.bind(this), 200));

        this.eventSource.addEventListener("open", () => {
            console.log("sse connect: opened");
        });

        this.eventSource.addEventListener("error", (event) => {
            console.log("sse connect: error", event);
        });
    }

    close() {
        if (this.eventSource) {
            // this.eventSource.removeAllEventListeners()
            this.eventSource.close();

            this.eventSource = null;

            console.log("sse close");
        }
    }

    private async setLastEventId(lastEventId: string) {
        try {
            // await AsyncStorage.setItem(this.storeKey, lastEventId)

            this._storage.save(this.storeKey, lastEventId);
            // eslint-disable-next-line no-empty
        } catch {}
    }

    private async getLastEventId() {
        try {
            // return await AsyncStorage.getItem(this.storeKey)

             
            return await this._storage.get(this.storeKey);
        } catch {
            return null;
        }
    }

    private async handleMessage(event: MessageEvent) {
        try {
            if (event.lastEventId) {
                this.setLastEventId(event.lastEventId);
            }

            const { from, message } = JSON.parse(event.data!);

            console.log("handleMessage", from);

            const connection = this.connections.find((item) => item.clientSessionId === from);

            if (!connection) {
                console.log(`connection with clientId "${from}" not found!`);
                return;
            }

            const sessionCrypto = new SessionCrypto(connection.sessionKeyPair);

            const request: AppRequest<RpcMethod> = JSON.parse(
                sessionCrypto.decrypt(Base64.decode(message).toUint8Array(), hexToByteArray(from))
            );

            if (this.activeRequests[from]) {
                await this.send(
                    {
                        error: {
                            code: SEND_TRANSACTION_ERROR_CODES.USER_REJECTS_ERROR,
                            message: "User has already opened the previous request",
                        },
                        id: request.id,
                    },
                    sessionCrypto,
                    from
                );

                return;
            }

            this.activeRequests[from] = request;

            if (
                !this.onTransactionConfirm ||
                !this.setTonconnectTransactionProps ||
                !this.setConnectedApps ||
                !this.connectedApps
            ) {
                console.log("unavailable setShowSendModal, setTonconnectTransactionProps");
                return;
            }

            const response = await TonConnect.handleRequestFromRemoteBridge(
                request,
                from,
                connection,
                this.onTransactionConfirm,
                this.setTonconnectTransactionProps
            );

            delete this.activeRequests[from];
            await this.send(response, sessionCrypto, from);

            this.redirectIfNeeded();
        } catch (e) {
            console.log("handleMessage error");
            console.error(e);
        }
    }
}
export const TonConnectRemoteBridge = new TonConnectRemoteBridgeService();
