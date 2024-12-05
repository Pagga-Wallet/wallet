import axios, { AxiosHeaders } from "axios";
import { mainnetTrongridAPI, testnetTrongridAPI } from "../const";

const headers = new AxiosHeaders({ "TRON-PRO-API-KEY": import.meta.env.VITE_TRONGRID_API_KEY });

export const trongridInstance = axios.create({
    baseURL:
        import.meta.env.VITE_NETWORK === "MAINNET"
            ? mainnetTrongridAPI
            : testnetTrongridAPI + "/v1",
    headers,
});
