import { CHAINS } from "@/shared/lib/types";

export type NFTItem = {
    chain: CHAINS;
    previewUrl: string;
    title: string;
    address: string;
};

export type NFTDetails = {
    chain: CHAINS;
    previewURL: string | undefined;
    name: string;
    address: string;
    owner: string;
    collection: {
        name: string;
    };
};
