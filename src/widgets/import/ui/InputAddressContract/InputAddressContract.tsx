import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Button, SearchInput } from "@/shared/components";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./InputAddressContract.module.sass";

interface InputAddressContractProps {
    addressContract: string;
    setAddressContract: React.Dispatch<React.SetStateAction<string>>;
}

export const InputAddressContract: FC<InputAddressContractProps> = ({
    addressContract,
    setAddressContract,
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
            <p className={s.title}>{t("common.enter-contract-address")}</p>

            <div className={s.innerActions}>
                <SearchInput
                    placeholder={t("common.search-by-address")}
                    setValue={setAddressContract}
                    value={addressContract}
                />
                <Button type="secondary" className={s.import} onClick={handleImportClick}>
                    <SvgSelector id="import" />
                </Button>
            </div>
        </div>
    );
};
