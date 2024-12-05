import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import { checkDesktopPlatform } from "@/shared/lib/helpers/checkDesktopPlatform";
import s from "./SearchInput.module.scss";

interface SearchInputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({ setValue, value, placeholder }) => {
    const ref = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const isDesktop = checkDesktopPlatform();

    useEffect(() => {
        const handleFocus = () => {
            if (isDesktop) return;
            const navbar = document.getElementById("navbar-bottom");
            if (navbar) {
                navbar.style.display = "none";
            }
        };

        const handleBlur = () => {
            const navbar = document.getElementById("navbar-bottom");
            if (navbar) {
                navbar.style.display = "flex";
            }
        };

        const input = ref.current;
        if (input) {
            input.addEventListener("focus", handleFocus);
            input.addEventListener("blur", handleBlur);
        }

        return () => {
            if (input) {
                input.removeEventListener("focus", handleFocus);
                input.removeEventListener("blur", handleBlur);
            }
        };
    }, []);

    return (
        <div
            className={clsx(s.search, { [s.focused]: isFocused })}
            onClick={() => {
                ref?.current?.focus();
            }}
        >
            <SvgSelector id="search" />
            <input
                ref={ref}
                type="text"
                className={s.searchInput}
                placeholder={placeholder ?? t("common.search-by-name")}
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            />
            {value.length >= 1 && (
                <button
                    className={s.searchClear}
                    onClick={() => {
                        setValue("");
                    }}
                >
                    <SvgSelector id="clear" />
                </button>
            )}
        </div>
    );
};
