import clsx from "clsx";
import { motion } from "framer-motion";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import s from "./TabSelector.module.scss";

interface TabSelector {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    tabs: string[];
    disabled?: boolean;
    className?: string;
}

export const TabSelector: FC<TabSelector> = ({
    disabled,
    activeTab,
    setActiveTab,
    tabs,
    className,
}) => {
    const { t } = useTranslation();

    return (
        <div className={clsx(s.tabs, { [s["tabs--disabled"]]: disabled }, className)}>
            {tabs.map((tab) => (
                <button
                    className={clsx(s.tabs_item, { [s.tabs_itemActive]: activeTab === tab })}
                    onClick={() => setActiveTab(tab)}
                    key={tab}
                >
                    {t(tab)}
                    {activeTab === tab && (
                        <motion.span
                            layoutId="bubble"
                            className={s.active}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};
