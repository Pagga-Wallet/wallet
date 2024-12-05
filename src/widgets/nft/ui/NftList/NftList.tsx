import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllNFTsQuery } from "@/entities/multichainAccount";
import { NftListItem } from "@/entities/nft";
import { SkeletonRound } from "@/shared/components/Skeletons";
import s from "./NftList.module.scss";

export const NftList: FC = () => {
    const { data: nfts, isFetching } = useGetAllNFTsQuery();
    const { t } = useTranslation();

    if (!isFetching && nfts?.items?.length === 0) {
        return <div className={s.emptyList}>{t("main.empty-nft")}</div>;
    }

    return (
        <div className={s.nftList}>
            {isFetching && <SkeletonRound customWidth="100%" height={160} />}
            {isFetching && <SkeletonRound customWidth="100%" height={160} />}
            {nfts?.items?.map((item) => (
                <NftListItem
                    address={item.address}
                    chain={item.chain}
                    previewUrl={item.previewUrl}
                    title={item.title}
                />
            ))}
        </div>
    );
};
