import { FC } from "react";
import { useNavigate } from "react-router-dom";
import tonLogo from "@/shared/lib/images/tonLogo.png";
import s from "./NftListItem.module.scss";

interface NftListItemProps {
    chain: string;
    title: string;
    previewUrl: string;
    address: string;
}

export const NftListItem: FC<NftListItemProps> = ({ chain, title, previewUrl, address }) => {
    const navigate = useNavigate();
    return (
        <div
            className={s.nft}
            onClick={() => {
                navigate(`/nft/${address}`);
            }}
        >
            <img src={previewUrl} alt="bg" className={s.nftBg} />
            <div className={s.chain}>{chain}</div>
            <div className={s.info}>
                <img src={tonLogo} alt="logo" className={s.infoLogo} />
                <div className={s.infoName}>{title}</div>
            </div>
        </div>
    );
};
