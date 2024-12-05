import { useInitData } from "@tma.js/sdk-react";
import clsx, { ClassValue } from "clsx";
import { FC, useState } from "react";

import AvatarImg from "@/shared/lib/images/avatar.png";

import s from "./Avatar.module.sass";

interface AvatarProps {
    className?: ClassValue;
}

export const Avatar: FC<AvatarProps> = ({ className }) => {
    const tgData = useInitData();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isValidImage, setIsValidImage] = useState<boolean>(true);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.currentTarget;
        if (img.naturalWidth === 1 && img.naturalHeight === 1) {
            setIsValidImage(false);
        } else {
            setIsLoading(false);
        }
    };

    return (
        <img
            src={
                isLoading && isValidImage
                    ? AvatarImg
                    : isValidImage
                    ? `https://t.me/i/userpic/320/${tgData?.user?.username}.jpg`
                    : AvatarImg
            }
            alt={tgData?.user?.username}
            className={clsx(s.userAvatar, className)}
            onLoad={handleImageLoad}
            onError={() => {
                setIsValidImage(false);
                setIsLoading(false);
            }}
        />
    );
};
