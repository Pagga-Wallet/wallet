import { FC } from "react";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./PointsBalance.module.sass";

interface PointsBalanceProps {
  balance: number;
}

export const PointsBalance: FC<PointsBalanceProps> = ({ balance = 0 }) => {
  const formattedBalance = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance);

  return (
    <div className={s.balance}>
      <SvgSelector id="points-value" />
      <p className={s.balanceValue}>{formattedBalance}</p>
    </div>
  );
};
