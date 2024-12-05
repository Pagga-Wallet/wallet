import axios, { AxiosInstance } from "axios";
import { EVM_CHAINS } from "@/shared/lib/types";
import { convertChain } from "../helpers/convertChain";

export const getOneInchInstanse = (chain: EVM_CHAINS): AxiosInstance =>
    axios.create({
        baseURL: `https://proxy.dewallet.pro/1inch/swap/v6.0/${convertChain(chain)}`,
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_DEMO_ONEINCH_KEY,
        },
    });
