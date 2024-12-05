import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Title } from "@/shared/components";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import SecuritySticker from "@/shared/lib/gifs/security.gif";
import { IntroductionSteps } from "../../types/IntroductionSteps";
import s from "./ConfirmPrivacyCreate.module.sass";

interface ConfirmPrivacyCreateProps {
    setStep: React.Dispatch<React.SetStateAction<IntroductionSteps>>;
}

export const ConfirmPrivacyCreate: FC<ConfirmPrivacyCreateProps> = ({ setStep }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onCreate = () => navigate("/create/mnemonic");

    useSetupMainButton({
        onClick: onCreate,
        params: {
            text: t("registration.create-wallet"),
            isEnabled: true,
            isVisible: true,
        },
    });

    useSetupBackButton({
        onBack: () => setStep(IntroductionSteps.hero),
    });

    return (
        <div className={s.inner}>
            <div className={s.innerImg}>
                <img src={SecuritySticker} width={200} height={200} alt="security sticker" />
            </div>

            <Title className={s.innerTitle} level={2}>
                {t("security.title")}
            </Title>

            <ul className={s.innerList}>
                {[...Array(3)].map((_, index) => (
                    <li key={index} className={s.innerItem}>
                        <div className={s.dot} />
                        <p>{t(`security.item-${index + 1}`)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
