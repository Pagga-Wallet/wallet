import clsx from "clsx";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Section } from "@/shared/components";

import { ExchangeItem } from "../../model/types";

import s from "./ExchangesCard.module.sass";

interface ExchangesCardProps extends ExchangeItem {}

export const ExchangesCard: FC<ExchangesCardProps> = ({ title, description, preview, link }) => {
    const { t } = useTranslation();

    const cardClasses = clsx(s.card, { [s.cardSoon]: !link });

    return (
        <Section.Link to={link} className={cardClasses}>
            <div className={s.cardInfo}>
                <img src={preview} alt={title} />
                <div className={s.cardInfoDetails}>
                    <p className={s.title}>
                        {title} {!link && <span>({t("common.coming-soon")})</span>}
                    </p>
                    <p className={s.description}>{t(description)}</p>
                </div>
            </div>
        </Section.Link>
    );
};
