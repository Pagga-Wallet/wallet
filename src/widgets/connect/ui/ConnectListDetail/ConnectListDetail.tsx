import dayjs from "dayjs";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ConnectItem } from "@/features/connect";
import { ConnectionType } from "@/shared/lib/types/connect";

import { IConnectionWithWalletName } from "@/entities/connection/model/types";
import { Emoji, Section, Title } from "@/shared/components";

import { smallAddress } from "@/shared/lib/helpers/smallAddress";

import s from "./ConnectListDetail.module.sass";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

interface ConnectListDetailProps {
    type: ConnectionType | null;
    detailInfo: IConnectionWithWalletName | null;
}

export const ConnectListDetail: FC<ConnectListDetailProps> = ({
    detailInfo,
    type
}) => {
    const { t } = useTranslation();

    return (
        <div className={s.inner}>
            <div className={s.innerTop}>
                <img
                    src={detailInfo?.iconUrl ?? ""}
                    alt={detailInfo?.name}
                    height={80}
                    width={80}
                />

                {detailInfo?.date && (
                    <div className={s.innerTopDate}>
                        {t("connect-wallet-list.linked")}:{" "}
                        {dayjs(detailInfo.date).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                )}
            </div>

            <div className={s.innerDetail}>
                {type && (
                    <>
                        <div className={s.item}>
                            <p className={s.itemLeft}>{t("common.network")}</p>
                            <p className={s.itemRight}>
                                {type === ConnectionType.TonConnect
                                    ? "The Open Network"
                                    : "Multichain"}
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className={s.innerInfo}>
                <div className={s.innerInfoItem}>
                    <SvgSelector id="activity" />
                    {t("connect-wallet-list.info-item-1")}
                </div>
                <div className={s.innerInfoItem}>
                    <SvgSelector id="checked-checked" />
                    {t("connect-wallet-list.info-item-2")}
                </div>
            </div>

            <Title level={2} className={s.title}>
                {t("connect-wallet-list.networks")}
            </Title>
            <ConnectItem
                title="TON"
                description={
                    detailInfo && "address" in detailInfo?.replyItems[0]
                        ? smallAddress(detailInfo?.replyItems[0]?.address, 8)
                        : undefined
                }
                preview="https://s2.coinmarketcap.com/static/img/coins/200x200/11419.png"
            />
        </div>
    );
};
