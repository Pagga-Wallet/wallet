import { FC, useState } from "react";

import { BaseLayout } from "@/shared/layouts";

import { IntroductionSteps } from "./types/IntroductionSteps";
import { ConfirmPrivacyCreate, HeroStep } from "./ui";

export const WelcomePage: FC = () => {
    const [step, setStep] = useState<IntroductionSteps>(IntroductionSteps.hero);

    return (
        <>
            {step === IntroductionSteps.hero && <HeroStep setStep={setStep} />}

            {step === IntroductionSteps.confirmPrivacyCreate && (
                <ConfirmPrivacyCreate setStep={setStep} />
            )}
        </>
    );
};
