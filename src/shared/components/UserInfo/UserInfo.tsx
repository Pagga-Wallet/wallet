import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { FC } from "react";

import UserProfile from "@/shared/lib/images/avatar.png";
import { Text } from "../Text/Text";


import s from "./UserInfo.module.sass";

interface UserInfoProps {}

export const UserInfo: FC<UserInfoProps> = ({}) => {
    const { initDataRaw, initData } = retrieveLaunchParams();
    return (
        <div className={s.profile}>
            <div className={s.profileAvatar}>
                <img src={initData?.user?.photoUrl ?? UserProfile} alt={initData?.user?.username} width={32} height={32} />
            </div>
            <Text className={s.profileInfo}>
                {initData?.user?.firstName} {" "} {initData?.user?.lastName}
            </Text>
        </div>
    )
};
