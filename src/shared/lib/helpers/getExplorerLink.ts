import { CHAINS } from "../types";

type GetExplorerLinkArgs = {
    txHash?: string;
    userAddress?: string;
    chain: CHAINS;
};

export const getExplorerLink = ({ txHash, userAddress, chain }: GetExplorerLinkArgs) => {
    let link: string;
    switch (chain) {
        case CHAINS.TON:
            link = txHash
                ? `https://tonviewer.com/${userAddress}/transaction/${txHash}`
                : `https://tonviewer.com/${userAddress}`;
            break;
        case CHAINS.ETH:
            link = `https://${
                import.meta.env.VITE_NETWORK === "TESTNET" ? "sepolia." : ""
            }etherscan.io/tx/${txHash}`;
            break;
        case CHAINS.BNB:
            link = `https://${
                import.meta.env.VITE_NETWORK === "TESTNET" ? "testnet." : ""
            }bscscan.com/tx/${txHash}`;
            break;
        case CHAINS.TRON:
            link = `https://tronscan.org/index.html#/transaction/${txHash}`;
            break;
        case CHAINS.SOLANA:
            link = `https://solscan.io/tx/${txHash}`;
            break;
        case CHAINS.SUI:
            link = `https://suiscan.xyz/${
                import.meta.env.VITE_NETWORK === "TESTNET" ? "testnet" : "mainnet"
            }/tx/${txHash}`;
            break;
        case CHAINS.STELLAR:
            link = txHash
                ? `https://stellar.expert/explorer/public/tx/${txHash}`
                : `https://stellar.expert/explorer/public/account/${userAddress}`;
            break;
        default:
            link = "";
            break;
    }
    return link;
};
