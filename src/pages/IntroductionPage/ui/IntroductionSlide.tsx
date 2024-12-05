import { FC } from "react";
import { Title } from "@/shared/components";
import { Slider } from "@/shared/components/Slider/Slider";
import s from "./IntroductionPage.module.sass";

interface IntroductionSlideProps {
    src: string;
    title: string;
    subtitle: string;
}

export const IntroductionSlide: FC<IntroductionSlideProps> = ({ src, title, subtitle }) => (
    <Slider.Slide key={title + subtitle}>
        <div className={s.container}>
            <div className={s.imageWrapper}>
                <img draggable={false} className={s.image} width={275} src={src} alt="" />
            </div>
            <Title className={s.title}>{title}</Title>
            <p className={s.subtitle}>{subtitle}</p>
        </div>
    </Slider.Slide>
);
