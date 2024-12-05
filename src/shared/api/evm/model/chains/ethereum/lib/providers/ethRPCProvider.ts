/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "ethers";

const SEPOLIA_BASE_URL = "https://sepolia.infura.io/v3/";
const MAINNET_BASE_URL = "https://mainnet.infura.io/v3/";

export const ethereumProvider = new ethers.JsonRpcProvider(
    (import.meta.env.VITE_NETWORK === "MAINNET" ? MAINNET_BASE_URL : SEPOLIA_BASE_URL) +
        import.meta.env.VITE_INFURA_API_KEY
);
// export const ethereumProvider = ethers.getDefaultProvider("mainnet")
