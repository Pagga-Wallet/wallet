import React, { useCallback, useState } from "react";
import { BaseLayout } from "@/shared/layouts";
import { pinCreationContext } from "../lib/context";
import { PINCreation } from "./PINCreation";

interface PINCreationProviderProps {
    children: React.ReactNode;
}

interface PINCreationState {
    isOpen: boolean;
    resolve: null | ((pin: string) => void);
    reject: null | (() => void);
}

const initialState = {
    isOpen: false,
    resolve: null,
    reject: null
};

export const PINCreationProvider = ({ children }: PINCreationProviderProps) => {
    const [{ isOpen, resolve, reject }, setState] = useState<PINCreationState>(initialState);

    const reset = () => {
        setState(initialState);
    };

    const setListeners = ({
        resolve,
        reject
    }: {
        resolve: (pin: string) => void;
        reject: () => void;
    }) => {
        setState(prevState => ({ ...prevState, resolve, reject }));
    };

    const open = () => {
        setState(prevState => ({
            ...prevState,
            isOpen: true
        }));
    };

    const onSuccess = useCallback(
        (pin: string) => {
            setState(prevState => ({
                ...prevState,
                isOpen: false
            }));
            resolve?.(pin);
            reset();
        },
        [resolve]
    );

    const onBack = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            isOpen: false
        }));
        reject?.();
        reset();
    }, [reject]);

    return (
        <>
            {isOpen && <PINCreation onBack={onBack} onSuccess={onSuccess} />}
            <pinCreationContext.Provider value={{ isOpen, open, setListeners }}>
                <div style={{ display: isOpen ? "none" : undefined }}>{children}</div>
            </pinCreationContext.Provider>
        </>
    );
};
