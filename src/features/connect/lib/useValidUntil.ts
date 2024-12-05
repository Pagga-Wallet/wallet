import { useEffect } from "react";

const getTimeSec = () => {
    return Math.floor(Date.now() / 1000);
};

export const useValidUntil = (value: number, cb: () => void) => {
    useEffect(() => {
        const interval = setInterval(() => {
            if (value < getTimeSec()) {
                cb();
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [value, cb]);
};
