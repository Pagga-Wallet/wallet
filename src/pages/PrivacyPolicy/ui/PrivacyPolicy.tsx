import { FC } from "react";

import { Text, Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";


import { useSetupBackButton } from "@/shared/lib";

import s from "./PrivacyPolicy.module.sass";

interface PrivacyPolicyProps {}

export const PrivacyPolicy: FC<PrivacyPolicyProps> = ({}) => {
    useSetupBackButton();
    return (
        <BaseLayout withoutPadding>
            <Title level={1} className={s.title}>User Agreement</Title>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
            <Text className={s.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis ut, architecto
                officiis vitae possimus, laudantium, deleniti ad explicabo excepturi nostrum harum
                perspiciatis maiores animi eaque dolore consequuntur nam illum et.
            </Text>
        </BaseLayout>
    );
};
