 
import { ethers } from "ethers";

const TESTNET_BASE_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const MAINNET_BASE_URL = "https://bsc-dataseed.binance.org/";

export const bscProvider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_NETWORK === "MAINNET" ? MAINNET_BASE_URL : TESTNET_BASE_URL
);
// export const ethereumProvider = ethers.getDefaultProvider("mainnet")
