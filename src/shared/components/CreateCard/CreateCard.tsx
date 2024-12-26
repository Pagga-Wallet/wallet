import { FC } from "react";
import { useNavigate } from "react-router-dom";

import CardIcon from "@/shared/lib/images/credit-card.svg?react";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import { Title } from "../Title/Title";
import { Text } from "../Text/Text";

import s from "./CreateCard.module.sass";

interface CreateCardProps {}

export const CreateCard: FC<CreateCardProps> = ({}) => {
  const navigate = useNavigate();

    return <div className={s.createCard} onClick={() => navigate("")}>
      <div className={s.createCardInner}>
        <CardIcon />

        <div className={s.createCardBody}>
          <Title level={3} className={s.createCardTitle}>
            Create card
          </Title>
          <Text className={s.createCardText}>
            Pass KYC to get a card
          </Text>
        </div>
      </div> 
      <SvgSelector id="chevron-right" />
    </div>;
};
