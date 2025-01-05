import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Button, SearchInput, Title } from "@/shared/components";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./InputAddressContract.module.sass";

interface InputAddressContractProps {
    addressContract: string;
    setAddressContract: React.Dispatch<React.SetStateAction<string>>;
}

export const InputAddressContract: FC<InputAddressContractProps> = ({
    addressContract,
    setAddressContract
}) => {
    const { t } = useTranslation();

    const handleImportClick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setAddressContract(text);
        } catch (error) {
            console.error("Failed to read clipboard contents: ", error);
        }
    };

    return (
        <div className={s.inner}>
            <Title level={2} className={s.subtitle}>
                {t("common.import")}
            </Title>
            <p className={s.title}>{t("common.enter-contract-address")}</p>

            <div className={s.innerActions}>
                <SearchInput
                    withIcon={false}
                    placeholder={t("import-token.input-placeholder")}
                    setValue={setAddressContract}
                    value={addressContract}
                    withClearIcon={false}
                />
                <Button type="grey" className={s.import} onClick={handleImportClick}>
                    {t("common.paste")}
                </Button>
            </div>
        </div>
    );
};
