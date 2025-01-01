import { FC } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput } from "@/shared/components";
import s from "./InputMemo.module.sass";

interface InputMemoProps {
    value: string;
    setValue: (value: string) => void;
}

export const InputMemo: FC<InputMemoProps> = ({ value, setValue }) => {
    const { t } = useTranslation();

    return (
        <>
            <div className={s.inputWrapper}>
                <div className={s.inputBlock}>
                    <BaseInput
                        value={value}
                        onChange={setValue}
                        placeholder={t("common.memo-enter")}
                        className={s.input}
                    />
                </div>
            </div>
        </>
    );
};
