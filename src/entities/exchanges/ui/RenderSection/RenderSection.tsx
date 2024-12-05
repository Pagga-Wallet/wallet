import { FC } from "react";

import { ExchangesCard } from "@/entities/exchanges";

import { exchangesList } from "@/shared/lib/consts/swap-list";

import { Section } from "../../../../shared/components/Section";

import { ExchangeItem } from "../../model/types";

import s from "./RenderSection.module.sass";

interface RenderSectionProps {
    title: string;
    icon: string;
    category: string;
}

export const RenderSection: FC<RenderSectionProps> = ({ title, icon, category }) => (
    <Section
        className={s.content}
        title={title}
        icon={<img src={icon} alt={category} width={20} height={20} />}
    >
        {(exchangesList as ExchangeItem[])
            .filter((exchange) => exchange.category === category)
            .map((exchange) => (
                <ExchangesCard key={exchange.title} {...exchange} />
            ))}
    </Section>
);
