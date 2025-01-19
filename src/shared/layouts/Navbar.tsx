import { FC } from "react";
import { useTranslation } from "react-i18next";

import AppsActiveIcon from "@/shared/assets/apps-active.svg?react";
import SettingsActiveIcon from "@/shared/assets/settings-active.svg?react";
import { NavLink } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import styles from "./MainLayout.module.scss";

const items = [
    {
        label: "menu.home",
        path: "/home",
        isStroke: false,
        icon: <SvgSelector id="home-icon" />,
        disabled: false,
    },
    {
        label: "menu.points",
        path: "/points",
        isStroke: false,
        icon: <SvgSelector id="points" />,
        disabled: true,
    },
    {
        label: "menu.apps",
        path: "/apps",
        isStroke: false,
        icon: <SvgSelector id="apps-icon" />,
        activeIcon: <AppsActiveIcon />,
        disabled: false,
    },
    {
        label: "menu.settings",
        path: "/settings",
        isStroke: false,
        icon: <SvgSelector id="settings-icon" />,
        activeIcon: <SettingsActiveIcon />,
        disabled: false,
    },
];

export const Navbar: FC = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.navbar} id="navbar-bottom">
            {items.map(item => (
                <NavLink
                    className={`${styles.navbar__item} ${item.disabled ? styles["navbar__item--disabled"] : ""}`}
                    to={item.disabled ? "" : item.path}
                    activeClassName={
                        !item.isStroke
                            ? styles["navbar__item--active"]
                            : styles["navbar__item--active-stroke"]
                    }
                    key={item.path}
                >
                    {({ isActive }) => (
                        <>
                            {isActive ? <>{item.activeIcon || item.icon}</> : <>{item.icon}</>}
                            <span className={styles.item_title}>{t(item.label)}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
};
