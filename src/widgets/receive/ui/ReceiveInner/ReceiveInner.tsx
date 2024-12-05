import QRCodeStyling from "qr-code-styling";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CopyField } from "@/shared/components";
import { SkeletonRect } from "@/shared/components/Skeletons";
import { CHAINS } from "@/shared/lib/types";
import s from "./ReceiveInner.module.sass";

interface ReceiveInnerProps {
    address: string;
    chain: CHAINS | null;
}

const qrCode = new QRCodeStyling({
    width: 180,
    height: 180,
    margin: -3,
    type: "svg",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png",
    qrOptions: {},
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.41,
        margin: 3,
    },
    dotsOptions: {
        type: "extra-rounded",
        color: "#249CCE",
    },
    backgroundOptions: { color: "transparent" },
    cornersSquareOptions: {
        type: "dot",
        color: "#249CCE",
    },
    cornersDotOptions: {
        type: "dot",
        color: "#249CCE",
    },
});

export const ReceiveInner: FC<ReceiveInnerProps> = ({ address, chain }) => {
    const { t } = useTranslation();
    const isTon = chain === CHAINS.TON;
    const ref = useRef(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
        }
        qrCode.update({ data: isTon ? "ton://transfer/" + address : address });
        setLoading(false);
    }, [address, isTon, loading]);

    return (
        <div className={s.receive}>
            <div className={s.receive__content}>
                {loading ? (
                    <div className={s.receiveQr}>
                        <SkeletonRect height={180} width={180} />
                    </div>
                ) : (
                    <div ref={ref} className={s.receiveQr} />
                )}
                <CopyField text={address} alertText={t("settings.address-copied")} />
                <div className={s.description}>
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
                </div>
            </div>
        </div>
    );
};
