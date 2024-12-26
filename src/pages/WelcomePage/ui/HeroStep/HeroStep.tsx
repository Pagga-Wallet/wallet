import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { Button, Text, Title } from "@/shared/components";

import { IntroductionSteps } from "../../types/IntroductionSteps";

import WelcomeImg from "@/shared/lib/images/welcome.png";

import s from "./HeroStep.module.sass";

interface HeroStepProps {
    setStep: React.Dispatch<React.SetStateAction<IntroductionSteps>>;
}

export const HeroStep: FC<HeroStepProps> = ({ setStep }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <div className={s.introduction}>
            <div className={s.introductionDecor}></div>
            <div className={s.hero}>
                <div className={s.heroInfo}>
                    <img src={WelcomeImg} alt="welcome" />
                    <Title level={1} className={s.heroTitle}>
                        {t("registration.title-welcome")}
                    </Title>
                    <Text className={s.heroDescription} size="small">
                        {t("registration.welcome-text")}
                    </Text>
                </div>
                <div className={s.heroActions}>
                    <Button
                        onClick={() => setStep(IntroductionSteps.confirmPrivacyCreate)}
                        type="purple"
                    >
                        {t("registration.create-wallet")}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/import/mnemonic");
                        }}
                        type="grey"
                    >
                        {t("registration.import-wallet")}
                    </Button>
                </div>

                <div className={s.heroPrivacy}>
                {t("registration.privacy-confirmation")}
                    <Link to="/privacy-policy">{t("registration.disclaimer")}</Link>
                </div>
            </div>
        </div>
    );
};
