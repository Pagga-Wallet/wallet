// import { mnemonicWordList } from "@ton/crypto";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
import clipboardy from "clipboardy";
import { useTranslation } from "react-i18next";
import { WordArea } from "@/shared/components";
// import styles from "./MnemonicInput.module.scss";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

// const MAX_SUGGESTION = 3;
//
// const getFilteredSuggestions = (value: string, maxSuggestion: number) => {
//     return mnemonicWordList
//         .filter((word) => word.toLowerCase().includes(value.toLowerCase()))
//         .slice(0, maxSuggestion);
// };

interface MnemonicInputProps {
    onChange(words: string[]): void;
}
export const MnemonicInput = ({ onChange }: MnemonicInputProps) => {
    const { t } = useTranslation();

    return (
        <>
            <WordArea
                onChange={onChange}
                placeholder={t("common.wordsMnemonic")}
                buttonProps={{
                    icon: <SvgSelector id="copy" />,
                    children: t("common.pasteClipboard"),
                    onClick: async (setWords) => {
                        try {
                            const value = await clipboardy.read();
                            const wordsInValue = value.split(/\s+/);
                            setWords(wordsInValue);
                            onChange(wordsInValue);
                        } catch (err) {
                            console.error("Failed to read clipboard contents: ", err);
                        }
                    },
                }}
            />
        </>
    );
};
