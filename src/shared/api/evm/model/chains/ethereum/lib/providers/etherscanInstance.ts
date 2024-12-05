import axios from "axios";

const MAINNET_BASE_URL = "https://api.etherscan.io/api/";
const SEPOLIA_BASE_URL = "https://api-sepolia.etherscan.io/api/";

export const etherscanInstanse = axios.create({
    baseURL: import.meta.env.VITE_NETWORK === "MAINNET" ? MAINNET_BASE_URL : SEPOLIA_BASE_URL,
    headers: {
        Accept: "application/json",
    },
    params: {
        apikey: import.meta.env.VITE_ETHERSCAN_PAID_API_KEY,
    },
});
