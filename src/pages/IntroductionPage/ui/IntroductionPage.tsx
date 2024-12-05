import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFinishOnboardingMutation, useGetOldAccountQuery } from "@/entities/multichainAccount";
import { Slider } from "@/shared/components/Slider/Slider";
import { BaseLayout } from "@/shared/layouts";
import { useSetupMainButton } from "@/shared/lib";
import { MultiAccountSlide } from "./slides/MultiaccoutSlide";
// import { MultichainSlide } from "./slides/MultichainSlide";
import { SwapSlide } from "./slides/SwapSlide";

const slides = [
    // <MultichainSlide />,
    <SwapSlide />,
    <MultiAccountSlide />,
];

export const IntroductionPage = () => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const { t } = useTranslation();
    const { data: oldAccount } = useGetOldAccountQuery();
    const [finishOnboarding] = useFinishOnboardingMutation();

    const isLastSlide = activeSlide === slides.length - 1;

    const onClick = useCallback(async () => {
        if (isLastSlide) {
            await finishOnboarding();
            if (oldAccount) {
                navigate("renew");
            } else {
                navigate("/");
            }
        } else {
            setActiveSlide(activeSlide + 1);
        }
    }, [activeSlide, oldAccount, isLastSlide]);

    useSetupMainButton({
        params: {
            text: isLastSlide ? t("introduction.sing-in") : t("common.continue"),
            isEnabled: true,
            isVisible: true,
            isLoaderVisible: false,
        },
        onClick,
    });

    return (
        <BaseLayout>
            <Slider activeSlide={activeSlide} onChange={setActiveSlide}>
                {slides}
            </Slider>
        </BaseLayout>
    );
};
