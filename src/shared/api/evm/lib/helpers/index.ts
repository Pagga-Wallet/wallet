import { CHAINS, EVM_CHAINS } from "@/shared/lib/types";
import { BNBAPIClient, BNBWallet } from "../../model/chains/bnb";
import { EthereumAPIClient, EthereumWallet } from "../../model/chains/ethereum";

// Расширять при добавлении EVM-чейна

type APIClient = BNBAPIClient | EthereumAPIClient;

export const getEVMAPIClientByChain = (address: string, chain: EVM_CHAINS): APIClient => {
    switch (chain) {
        case CHAINS.BNB:
            return new BNBAPIClient(address);
        case CHAINS.ETH:
            return new EthereumAPIClient(address);
    }
};

type Wallet = BNBWallet | EthereumWallet;

export const getEVMWalletByChain = (address: string, chain: EVM_CHAINS): Wallet => {
    switch (chain) {
        case CHAINS.BNB:
            return new BNBWallet(address);
        case CHAINS.ETH:
            return new EthereumWallet(address);
    }
};
