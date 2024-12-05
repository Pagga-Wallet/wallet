import { CHAINS } from "@/shared/lib/types";
import { GetNFT_DTO } from "../types/getNFTDTO";

export const getNFTDetailsDTOToNFTDetails = (dto: GetNFT_DTO) => ({
    chain: CHAINS.TON,
    name: dto.metadata.name,
    address: dto.address,
    previewURL: dto.previews?.[2].url,
    collection: {
        name: dto.collection.name,
    },
    owner: dto.owner.address,
});
