import { FC, useEffect, useState } from "react";

import s from "./AppsBanners.module.sass";

interface ImageSwapperProps {
    imageUrl: string;
    children: React.ReactNode;
}

export const ImageSwapper: FC<ImageSwapperProps> = ({ imageUrl, children }) => {
    const [ loaded, setLoaded ] = useState<boolean>(false)

    useEffect(() => {
      const img = new Image()
      img.src = imageUrl
      img.onload = () => setLoaded(true)
    }, [ imageUrl ])

    return <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className={`${s.bannerBox} ${loaded ? s.bannerBoxLoaded : ""}`}
        style={{
          backgroundImage: `url('${imageUrl}')`
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      >
        {children}
      </div>
    </div>;
};
