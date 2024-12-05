import { initUtils } from "@tma.js/sdk";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFetchNFTDetailsQuery } from "@/entities/nft/model/nftAPI";
import ArrowUpIcon from "@/shared/assets/arrow-up.svg?react";
import SearchIcon from "@/shared/assets/search.svg?react";
import { SkeletonRound } from "@/shared/components/Skeletons";
import tonLogo from "@/shared/lib/images/tonLogo.png";
import s from "./NftDetailManage.module.scss";

interface NftDetailManageProps {
    address: string;
}

export const NftDetailManage = ({ address }: NftDetailManageProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: nftDetails, isFetching } = useFetchNFTDetailsQuery({
        address,
    });
    const utils = initUtils();

    const onSend = () => {
        navigate("/nft/send", {
            state: {
                address,
            },
        });
    };

    const onOpen = () => {
        utils.openLink(`https://tonviewer.com/${address}`);
    };

    return (
        <div className={s.manage}>
            {isFetching ? (
                <SkeletonRound customWidth={340} height={340} />
            ) : (
                <img src={nftDetails?.previewURL} alt="nft" className={s.manageImage} />
            )}
            {isFetching ? (
                <SkeletonRound customWidth={340} height={72} />
            ) : (
                <div className={s.manageInfo}>
                    <img src={tonLogo} className={s.manageInfoChain} alt="chain" />
                    <div className={s.manageInfoTitle}>{nftDetails?.name}</div>
                </div>
            )}
            <div className={s.actions}>
                <button className={s.actionsItem} onClick={onSend}>
                    <span className={s.action__icon}>
                        <ArrowUpIcon />
                    </span>
                    <div className={s.actionsItemTitle}>{t("nft-details.send")}</div>
                </button>
                <button className={s.actionsItem} onClick={onOpen}>
                    <span className={s.action__icon}>
                        <SearchIcon />
                    </span>
                    <div className={s.actionsItemTitle}>{t("nft-details.look")}</div>
                </button>
            </div>
        </div>
    );
};
