import { AxiosHeaders } from "axios";
import { TronWeb } from "tronweb";
import { mainnetTrongridAPI, testnetTrongridAPI } from "../const";

const headers = new AxiosHeaders({ "TRON-PRO-API-KEY": import.meta.env.VITE_TRONGRID_API_KEY });

export const tronwebProviderOptions = {
    fullHost: import.meta.env.VITE_NETWORK === "MAINNET" ? mainnetTrongridAPI : testnetTrongridAPI,
    headers,
};

export const tronwebProvider = new TronWeb(tronwebProviderOptions);
