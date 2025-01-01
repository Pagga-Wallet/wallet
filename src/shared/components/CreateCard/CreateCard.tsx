import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CardIcon from "@/shared/lib/images/credit-card.svg?react";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import { Title } from "../Title/Title";
import { Text } from "../Text/Text";

import s from "./CreateCard.module.sass";

interface CreateCardProps {}

export const CreateCard: FC<CreateCardProps> = ({}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

    return <div className={s.createCard} onClick={() => navigate("")}>
      <div className={s.createCardInner}>
        <CardIcon />

        <div className={s.createCardBody}>
          <Title level={3} className={s.createCardTitle}>
            {t("create-card.title")}
          </Title>
          <Text className={s.createCardText}>
            {t("create-card.description")}
          </Text>
        </div>
      </div> 
      <SvgSelector id="chevron-right" />
    </div>;
};
