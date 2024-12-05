import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { Button, Checkbox } from "@/shared/components";

import welcomeGif from "@/shared/lib/gifs/welcome.gif";

import { IntroductionSteps } from "../../types/IntroductionSteps";

import s from "./HeroStep.module.sass";

interface HeroStepProps {
    setStep: React.Dispatch<React.SetStateAction<IntroductionSteps>>;
}

export const HeroStep: FC<HeroStepProps> = ({ setStep }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [isConfirmedPrivacy, setIsConfirmedPrivacy] = useState<boolean>(false);

    return (
        <div className={s.introduction}>
            <div className={s.hero}>
                <img src={welcomeGif} alt="welcome gif" className={s.heroGif} />
                <div className={s.heroTitle}>{t("registration.title-welcome")}</div>
                <p className={s.heroDescription}>
                    {t("registration.welcome-text1")} {t("registration.welcome-text2")}
                </p>
            </div>
            <div className={s.privacyConfirm}>
                <Checkbox
                    isConfirmed={isConfirmedPrivacy}
                    setIsConfirmed={() => setIsConfirmedPrivacy(!isConfirmedPrivacy)}
                />
                <Link to="/privacy-policy">{t("registration.privacy-confirmation")}</Link>
            </div>
            <div className={s.actions}>
                <Button
                    onClick={() => setStep(IntroductionSteps.confirmPrivacyCreate)}
                    type="primary"
                    isDisabled={!isConfirmedPrivacy}
                >
                    {t("registration.create-wallet")}
                </Button>
                <Button
                    onClick={() => {
                        navigate("/import/mnemonic");
                    }}
                    type="secondary"
                    isDisabled={!isConfirmedPrivacy}
                >
                    {t("registration.import-wallet")}
                </Button>
            </div>
        </div>
    );
};
