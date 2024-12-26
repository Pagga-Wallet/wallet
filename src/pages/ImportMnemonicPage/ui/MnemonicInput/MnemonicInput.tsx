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
    isImport?: boolean;
}
export const MnemonicInput = ({ onChange, isImport }: MnemonicInputProps) => {
    const { t } = useTranslation();

    return (
        <>
            <WordArea
                onChange={onChange}
                placeholder={t("common.wordsMnemonic")}
                isImport={isImport}
                buttonProps={{
                    icon: <SvgSelector id="copy-2" />,
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
