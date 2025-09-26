import clsx, { ClassValue } from "clsx";
import React, { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./WordArea.module.scss";

interface WordAreaProps {
    placeholder?: string;
    disabled?: boolean;
    buttonProps?: {
        onClick?: (cb: (words: string[]) => void, words: string[]) => void;
        children: React.ReactNode;
        icon: React.ReactNode;
    };
    onChange?: (words: string[]) => void;
    value?: string[];
    title?: ReactNode;
    isImport?: boolean;
}

interface WordProps {
    text: string;
    index: number;
    isImport?: ClassValue;
}

const Word = ({ text, index, isImport }: WordProps) => {
    return (
        <span className={clsx(styles.word, { [styles.wordImport]: isImport })}>
            {index}. {text}
        </span>
    );
};
export const WordArea = ({
    placeholder,
    disabled,
    buttonProps,
    onChange,
    value,
    title,
    isImport
}: WordAreaProps) => {
    const [inputValue, setInputValue] = useState("");
    const refInput = useRef<HTMLInputElement | null>(null);
    const [words, setWords] = useState<string[]>(value || []);

    const { t } = useTranslation();

    const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (words.length === 24) {
            return;
        }
        const value = event.currentTarget.value;
        const trimmedValue = value.trim();
        const wordsInValue = value.split(/\s+/);

        if (wordsInValue.length > 2) {
            setWords(oldValue => {
                const newValue = [...oldValue, ...wordsInValue];
                onChange?.(newValue);
                return newValue;
            });
            return;
        }

        setInputValue(trimmedValue);

        if (trimmedValue.length > 1 && value.endsWith(" ")) {
            setWords(oldValue => {
                const newValue = [...oldValue, trimmedValue];
                onChange?.(newValue);
                return newValue;
            });
            setInputValue("");
        }
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value;
        if (e.key === "Backspace" && !text && words.length && !disabled) {
            setWords(oldValue => {
                const newValue = oldValue.slice(0, -1);
                onChange?.(newValue);
                return newValue;
            });
        }
    };

    useEffect(() => {
        if (value) {
            setWords(value);
        }
    }, [value]);

    return (
        <div
            className={styles.wordArea}
            onClick={() => {
                if (!disabled) {
                    refInput.current?.focus();
                }
            }}
        >
            {title && <span className={styles.title}>{title}</span>}
            <div
                className={clsx(styles.container, {
                    [styles.containerImport]: isImport
                })}
            >
                {words.map((word, i) => (
                    <Word text={word} index={i + 1} key={i} isImport={isImport} />
                ))}

                <input
                    ref={refInput}
                    type="text"
                    style={{
                        width: words.length === 0 ? "23ch" : `${inputValue.length + 1}ch`
                    }}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    value={inputValue}
                    onChange={_onChange}
                    className={styles.input}
                    placeholder={words.length === 0 ? placeholder : ""}
                />
            </div>
            {buttonProps && (
                <button
                    className={styles.button}
                    onClick={() => {
                        buttonProps.onClick?.(setWords, words);
                    }}
                >
                    <span className={styles.button__icon}>{buttonProps.icon}</span>
                    {buttonProps.children}
                </button>
            )}
        </div>
    );
};
