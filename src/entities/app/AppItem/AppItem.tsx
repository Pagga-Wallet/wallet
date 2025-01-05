import { FC } from "react";
import clsx, { ClassValue } from "clsx";

import { App } from "@/shared/api/apps";

import { useNavigateApps } from "@/shared/lib/hooks/useNavigateApps";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./AppItem.module.sass";

interface AppItemProps extends App {
  onClick?: () => void
  className?: ClassValue
  isFirst: boolean
  isLast: boolean
  isSingle?: boolean
}

export const AppItem: FC<AppItemProps> = ({
  description,
  logo,
  title,
  type,
  className,
  link,
  isFirst,
  isLast,
  isSingle,
  onClick
}) => {
    const navigateApps = useNavigateApps()

    return <div className={clsx(
      s.app,
      {
        [s.appFirst]: isFirst,
        [s.appLast]: isLast,
        [s.appSingle]: isSingle
      },
      className
    )}
    onClick={() => navigateApps(link ?? '', type ?? '')}
    >
      <div className={s.appLeft}>
        <div className={s.appLeftLogo}>
          <img src={logo} alt={title} width={40} height={40} />
        </div>
        <div className={s.appLeftBody}>
          <p className={s.appLeftTitle}>
            {title}
          </p>
          <p className={s.appLeftDescription}>
            {description}
          </p>
        </div>
      </div>
      <SvgSelector id="chevron-right" />
    </div>;
};
