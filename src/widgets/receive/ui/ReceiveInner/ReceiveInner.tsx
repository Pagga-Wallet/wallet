import QRCodeStyling from "qr-code-styling";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CopyField, ReceiveMessage, Text, Title } from "@/shared/components";
import { SkeletonRect } from "@/shared/components/Skeletons";
import { BaseLayout } from "@/shared/layouts";
import { getSelectBlockhainConfig, importList } from "@/shared/lib/consts/import-list";
import { CHAINS } from "@/shared/lib/types";

import s from "./ReceiveInner.module.sass";

interface ReceiveInnerProps {
    address: string;
    chain: CHAINS | null;
}

const qrCode = new QRCodeStyling({
    width: 200,
    height: 200,
    type: "svg",
    qrOptions: {},
    dotsOptions: {
        type: "extra-rounded",
        color: "#FBFBFB"
    },
    backgroundOptions: { color: "transparent" },
    cornersSquareOptions: {
        type: "dot",
        color: "#FBFBFB"
    },
    cornersDotOptions: {
        type: "dot",
        color: "#FBFBFB"
    }
});

export const ReceiveInner: FC<ReceiveInnerProps> = ({ address, chain }) => {
    const { t } = useTranslation();
    const isTon = chain === CHAINS.TON;
    const ref = useRef(null);
    const [loading, setLoading] = useState<boolean>(true);

    const configNetworks = getSelectBlockhainConfig();

    const currentChain = configNetworks.find(t => t.chain === chain)

    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
        }
        qrCode.update({ data: isTon ? "ton://transfer/" + address : address });
        setLoading(false);
    }, [address, isTon, loading]);

    return (
        <BaseLayout withoutPadding withDecor className={s.inner}>
            <div className={s.innerTop}>
                <Title className={s.innerTopTitle} level={1}>{t("receive.title")}</Title>
                {currentChain && (
                    <div className={s.chainInfo}>
                        <img src={currentChain?.previewUrl} width={22} height={22} />
                        <Text className={s.chainInfoTitle}>{currentChain?.category}</Text>
                        <div className={s.chainInfoChain}>{currentChain?.chain}</div>
                    </div>
                )}
            </div>

            <div className={s.innerBottom}>
                {currentChain && (
                    <ReceiveMessage category={currentChain?.category} chain={currentChain?.chain} />
                )}
                <div className={s.innerContent}>
                    {loading ? (
                        <div className={s.receiveQr}>
                            <SkeletonRect height={200} width={200} />
                        </div>
                    ) : (
                        <div ref={ref} className={s.receiveQr} />
                    )}
                    <CopyField text={address} alertText={t("settings.address-copied")} />
                    {/* <div className={s.description}>
                    {isTon ? (
                        <>
                            {t("receive.title")} <span>{t("receive.ton-or-jettons")}</span>{" "}
                            {t("receive.via")} <span>{t("receive.the-open-network")}</span>{" "}
                            {t("receive.to-this-address")} <span>{t("receive.ton-or-jetton")}</span>{" "}
                            {t("receive.or-more-deposit")}
                        </>
                    ) : (
                        <>{t("receive.receive-other")}</>
                    )}
                </div> */}
                </div>
            </div>
        </BaseLayout>
    );
};
