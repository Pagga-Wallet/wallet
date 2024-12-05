import { useTranslation } from "react-i18next";
import { IntroductionSlide } from "../IntroductionSlide";

export const SwapSlide = () => {
    const { t } = useTranslation();
    return (
        <IntroductionSlide
            src="https://raw.githubusercontent.com/delab-team/manifests-images/main/introduction-swap.png"
            title={t("introduction.swap-title")}
            subtitle={t("introduction.swap-subtitle")}
        />
    );
};
