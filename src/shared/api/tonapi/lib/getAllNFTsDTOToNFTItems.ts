import { CHAINS } from "../../../lib/types";
import { GetAllNFTsDTO } from "../types";

export const getAllNFTsDTOToNFTItems = (dto: GetAllNFTsDTO) => {
    return dto.nft_items.map((nft) => ({
        previewUrl: nft.previews?.[2]?.url || "",
        title: nft.metadata.name,
        chain: CHAINS.TON,
        address: nft.address,
    }));
};
