export type QueryConnect = {
    strategy?: string | null;
    version: string;
    id: string;
    request: string;
};

export enum ConnectionType {
    TonConnect = 'ton-connect',
    WalletConnect = 'wallet-connect',
}