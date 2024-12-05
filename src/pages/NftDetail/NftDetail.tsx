import { FC } from "react";
import { useParams } from "react-router-dom";
import { NftDetailManage } from "@/entities/nft";
import { PrivateLayout } from "@/shared/layouts";
import { useSetupBackButton } from "@/shared/lib";
import { CardCollection } from "./CardCollection/CardCollection";
import s from "./NftDetail.module.scss";

export const NftDetail: FC = () => {
    useSetupBackButton();
    const { address } = useParams();
    return (
        <PrivateLayout>
            <div className={s.detail}>
                <NftDetailManage address={address!} />
                <CardCollection address={address!} />
            </div>
        </PrivateLayout>
    );
};
