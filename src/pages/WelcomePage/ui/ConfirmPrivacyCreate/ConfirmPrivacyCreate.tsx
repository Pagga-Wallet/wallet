import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Checkbox, CustomButton, Title } from "@/shared/components";
import { useSetupBackButton } from "@/shared/lib";
import SecuritySticker from "@/shared/lib/images/safety.svg?react";
import { IntroductionSteps } from "../../types/IntroductionSteps";
import s from "./ConfirmPrivacyCreate.module.sass";
import { BaseLayout } from "@/shared/layouts";
import { WithDecorLayout } from "@/shared/layouts/layouts";

interface ConfirmPrivacyCreateProps {
    setStep: React.Dispatch<React.SetStateAction<IntroductionSteps>>;
}

export const ConfirmPrivacyCreate: FC<ConfirmPrivacyCreateProps> = ({ setStep }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onCreate = () => navigate("/create/mnemonic");

    const [confirmedStates, setConfirmedStates] = useState<boolean[]>([false, false, false]);

    const handleCheckboxChange = (index: number) => {
        setConfirmedStates(prev => prev.map((state, i) => (i === index ? !state : state)));
    };

    useSetupBackButton({
        onBack: () => setStep(IntroductionSteps.hero)
    });

    const securityItems = [
        t("security.item-1"), 
        t("security.item-2"), 
        t("security.item-3")
    ];

    return (
        <>
            <WithDecorLayout>
                <div className={s.innerImg}>
                    <SecuritySticker />
                </div>

                <Title className={s.innerTitle} level={2}>
                    {t("security.title")}
                </Title>

                <ul className={s.innerList}>
                    {securityItems.map((item, index) => (
                        <li
                            key={`security-item-${index}`}
                            className={s.innerItem}
                            onClick={() => handleCheckboxChange(index)}
                        >
                            <Checkbox
                                isConfirmed={confirmedStates[index]}
                                setIsConfirmed={() => {}}
                            />
                            <p className={s.innerItemText}>{item}</p>
                        </li>
                    ))}
                </ul>
                <CustomButton
                    firstButton={{
                        children: <>{t("registration.create-wallet")}</>,
                        type: "purple",
                        onClick: onCreate,
                        isDisabled: !confirmedStates.every(state => state)
                    }}
                />
            </WithDecorLayout>
        </>
    );
};
