import { isValidSuiAddress } from "@mysten/sui/utils";
import { PublicKey } from "@solana/web3.js";
import { Address } from "@ton/core";
import { ethers } from "ethers";
import { TronWeb } from "tronweb";
import { tonAPIClient } from "@/shared/api/tonapi";
import { CHAINS, isEVMChain } from "../types";

export const checkAddress = async (
    address: string | undefined,
    chain: CHAINS
): Promise<string | null> => {
    try {
        if (!address) return null;
        if (isEVMChain(chain)) {
            return ethers.isAddress(address) ? address : null;
        } else if (chain === CHAINS.TON) {
            if (address.endsWith(".ton") || address.endsWith(".t.me")) {
                const res = await tonAPIClient.getAddressByDomain({ domain: address });
                if (!res || res?.wallet.address.length === 0) {
                    return null;
                }
                return Address.parse(res?.wallet.address).toString({ bounceable: false });
            } else {
                return Address.parse(address).toString({ bounceable: false }) || null;
            }
        } else if (chain === CHAINS.TRON) {
            return TronWeb.isAddress(address) ? address : null;
        } else if (chain === CHAINS.SOLANA) {
            try {
                const pubkey = new PublicKey(address);
                return pubkey ? address : null;
            } catch (error) {
                return null;
            }
        } else if (chain === CHAINS.SUI) {
            return isValidSuiAddress(address) ? address : null;
        } else return null;
    } catch (error) {
        return null;
    }
};

export const checkAddressFromUnknownChain = async (
    address: string
): Promise<{ address: string; chain: CHAINS } | null> => {
    try {
        if (!address) return null;
        // TON
        if (address.endsWith(".ton") || address.endsWith(".t.me")) {
            const res = await tonAPIClient.getAddressByDomain({ domain: address });
            if (!res || res?.wallet.address.length === 0) {
                return null;
            }
            const tonAddress =
                Address.parse(res?.wallet.address).toString({ bounceable: false }) || null;
            if (tonAddress) return { address: tonAddress, chain: CHAINS.TON };
            else return null;
        }
        if (Address.isFriendly(address)) {
            const tonAddress = Address.parse(address).toString({ bounceable: false }) || null;
            if (tonAddress) return { address: tonAddress, chain: CHAINS.TON };
        }
        if (TronWeb.isAddress(address)) return { address, chain: CHAINS.TRON };
        if (ethers.isAddress(address)) return { address, chain: CHAINS.ETH };
        if (isValidSuiAddress(address)) return { address, chain: CHAINS.SUI };
        try {
            const pubkey = new PublicKey(address);
            if (pubkey) return { address, chain: CHAINS.SOLANA };
        } catch (error) {
            console.error(error);
        }

        return null;
    } catch (error) {
        return null;
    }
};
