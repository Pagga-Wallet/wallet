import { motion, PanInfo, useMotionValue } from "framer-motion";
import { clamp, range } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Slider.module.scss";

interface DotsProps {
    count: number;
    active: number;
    onClick: (index: number) => void;
}

const Dots = ({ count, active, onClick }: DotsProps) => (
    <div className={styles.dotContainer}>
        {range(count).map((i) => (
            <motion.div
                key={i}
                onClick={() => onClick(i)}
                className={styles.dot}
                animate={{
                    width: active == i ? 20 : 8,
                    opacity: active === i ? 1 : 0.5,
                }}
            />
        ))}
    </div>
);

interface SlideProps {
    children: React.ReactNode;
}

const Slide = ({ children }: SlideProps) => <div className={styles.slide}>{children}</div>;

interface SliderProps {
    children: React.ReactNode;
    onChange: (index: number) => void;
    activeSlide: number;
}

export const Slider = ({ activeSlide, children, onChange }: SliderProps) => {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        setActive(activeSlide);
    }, [activeSlide]);

    const width = (constraintsRef.current && constraintsRef.current.offsetWidth) || 350;

    const onClickDot = (index: number) => {
        setActive(index);
        onChange(index);
    };

    return (
        <div ref={constraintsRef} className={styles.container}>
            <motion.div
                className={styles.slider}
                animate={{
                    x: -1 * active * width,
                }}
            >
                {children}
            </motion.div>
            <Dots count={React.Children.count(children)} active={active} onClick={onClickDot} />
        </div>
    );
};

Slider.Slide = Slide;
