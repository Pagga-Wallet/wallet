import React, { FC, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "./AutoCompleteInput.module.scss";

interface AutoCompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
}

export const AutoCompleteInput: FC<AutoCompleteInputProps> = ({ value, onChange, suggestions }) => {
    const [isDatalistOpen, setDatalistOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { t } = useTranslation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = e.target.value.trim();
        onChange(trimmedValue);
        setDatalistOpen(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setDatalistOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            setDatalistOpen(false);
        }
    };

    const handleTabPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            setDatalistOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setDatalistOpen(false);
            }
        };

        if (inputRef.current) {
            inputRef.current.addEventListener("click", handleClick);
        }

        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener("click", handleClick);
            }
        };
    }, []);

    useEffect(() => {
        if (value && suggestions.includes(value)) {
            setDatalistOpen(false);
        }
    }, [value, suggestions]);

    return (
        <div className={styles.container}>
            <input
                value={value}
                onChange={handleInputChange}
                onFocus={() => setDatalistOpen(true)}
                onKeyDown={handleTabPress}
                className={styles.input}
                ref={inputRef}
                type="text"
                placeholder={t("common.placeholder-type")}
            />
            {isDatalistOpen && value.length >= 1 && suggestions.length > 0 && (
                <div className={styles.list}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={styles.div}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
