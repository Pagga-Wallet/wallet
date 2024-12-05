import axios from "axios";

const MAINNET_BASE_URL = "https://api.bscscan.com/api/";
const TESTNET_BASE_URL = "https://api-testnet.bscscan.com/api/";

export const bscInstance = axios.create({
    baseURL: import.meta.env.VITE_NETWORK === "MAINNET" ? MAINNET_BASE_URL : TESTNET_BASE_URL,
    headers: {
        Accept: "application/json",
    },
    params: {
        apikey: import.meta.env.VITE_BSCSCAN_API_KEY,
    },
});
