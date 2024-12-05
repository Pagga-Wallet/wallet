import clsx from "clsx";
import { NavLink as BaseNavLink, NavLinkProps as BaseNavLinkProps } from "react-router-dom";

export interface NavLinkProps extends BaseNavLinkProps {
    activeClassName?: string;
}
export const NavLink = ({ className, activeClassName, ...props }: NavLinkProps) => {
    return (
        <BaseNavLink
            {...props}
            className={({ isActive }) =>
                isActive && activeClassName ? clsx(activeClassName, className) : clsx(className)
            }
        />
    );
};
