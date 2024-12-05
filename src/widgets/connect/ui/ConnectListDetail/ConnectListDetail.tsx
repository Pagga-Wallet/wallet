import dayjs from "dayjs";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ConnectItem } from "@/features/connect";

import { IConnectionWithWalletName } from "@/entities/connection/model/types";
import { Emoji, Section, Title } from "@/shared/components";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";

import s from "./ConnectListDetail.module.sass";

interface ConnectListDetailProps {
    detailInfo: IConnectionWithWalletName | null;
    handleRemove: () => void;
}

export const ConnectListDetail: FC<ConnectListDetailProps> = ({ detailInfo, handleRemove }) => {
    const { t } = useTranslation();

    return (
        <div className={s.inner}>
            <ConnectItem title={detailInfo?.name ?? "name"} preview={detailInfo?.iconUrl ?? ""} />

            <div className={s.innerDetail}>
                <div className={s.item}>
                    <p className={s.itemLeft}>{t("connect-wallet-list.wallet")}</p>
                    <p className={s.itemRight}>
                        {detailInfo?.walletFullName ?? "Account"}{" "}
                        {detailInfo?.accId && <Emoji id={+detailInfo.accId} />}
                    </p>
                </div>
                {detailInfo?.date && (
                    <>
                        <SvgSelector id="dotted-line" />
                        <div className={s.item}>
                            <p className={s.itemLeft}>{t("connect-wallet-list.linked")}</p>
                            <p className={s.itemRight}>
                                {dayjs(detailInfo.date).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                        </div>
                    </>
                )}
            </div>

            <Title level={2} className={s.title}>
                {t("connect-wallet-list.networks")}
            </Title>
            <ConnectItem
                title="TON"
                description={
                    detailInfo && "address" in detailInfo.replyItems[0]
                        ? smallAddress(detailInfo?.replyItems[0]?.address, 8)
                        : undefined
                }
                preview="https://s2.coinmarketcap.com/static/img/coins/200x200/11419.png"
            />

            <div className={s.actions}>
                <Section.Button danger onClick={handleRemove}>
                    {t("connect-wallet-list.delete-connection")}
                    <SvgSelector id="chevron-right" />
                </Section.Button>
            </div>
        </div>
    );
};
