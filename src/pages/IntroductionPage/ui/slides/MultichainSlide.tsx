import { useTranslation } from "react-i18next";
import { IntroductionSlide } from "../IntroductionSlide";

export const MultichainSlide = () => {
    const { t } = useTranslation();
    return (
        <IntroductionSlide
            src="https://raw.githubusercontent.com/delab-team/manifests-images/main/introduction-multichain.png"
            title={t("introduction.multichain-title")}
            subtitle={t("introduction.multichain-subtitle")}
        />
    );
};
