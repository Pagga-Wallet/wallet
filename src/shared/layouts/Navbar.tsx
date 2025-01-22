import { FC } from "react";
import { useTranslation } from "react-i18next";

import { NavLink } from "@/shared/components";

import HomeIcon from "@/shared/assets/home.svg?react";
import HomeActiveIcon from "@/shared/assets/home-active.svg?react";
import AppsIcon from "@/shared/assets/apps.svg?react";
import AppsActiveIcon from "@/shared/assets/apps-active.svg?react";
import PointsIcon from "@/shared/assets/points.svg?react";
import PointsActiveIcon from "@/shared/assets/points-active.svg?react";
import SettingsIcon from "@/shared/assets/settings.svg?react";
import SettingsActiveIcon from "@/shared/assets/settings-active.svg?react";

import styles from "./MainLayout.module.scss";

const items = [
    {
        label: "menu.home",
        path: "/home",
        isStroke: false,
        icon: <HomeIcon />,
        activeIcon: <HomeActiveIcon />,
        disabled: false,
    },
    {
        label: "menu.apps",
        path: "/apps",
        isStroke: false,
        icon: <AppsIcon />,
        activeIcon: <AppsActiveIcon />,
        disabled: false,
    },
    {
        label: "menu.points",
        path: "/points",
        isStroke: false,
        icon: <PointsIcon />,
        activeIcon: <PointsActiveIcon />,
        disabled: false,
    },
    {
        label: "menu.settings",
        path: "/settings",
        isStroke: false,
        icon: <SettingsIcon />,
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
