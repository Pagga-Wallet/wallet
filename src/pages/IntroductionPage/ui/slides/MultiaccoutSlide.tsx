import { useTranslation } from "react-i18next";
import { IntroductionSlide } from "../IntroductionSlide";

export const MultiAccountSlide = () => {
    const { t } = useTranslation();
    return (
        <IntroductionSlide
            src="https://raw.githubusercontent.com/delab-team/manifests-images/main/introduction-multiaccount.png"
            title={t("introduction.multiaccount-title")}
            subtitle={t("introduction.multiaccount-subtitle")}
        />
    );
};
