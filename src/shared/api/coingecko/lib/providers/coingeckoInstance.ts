import axios from "axios";

export const coingeckoInstanse = axios.create({
    baseURL: "https://api.coingecko.com/api/v3",
    headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_DEMO_COINGECKO_KEY,
    },
});
