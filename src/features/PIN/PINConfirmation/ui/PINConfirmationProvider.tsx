import React, { useState } from "react";
import { BaseLayout } from "@/shared/layouts";
import { confirmationContext, ConfirmationState } from "../lib/context";
import { PINConfirmation } from "./PINConfirmation";

interface PINConfirmationProviderProps {
    children: React.ReactNode;
}

const initialState: ConfirmationState = {
    isOpen: false,
    title: "",
    isLoading: false,
    action: null,
    state: undefined,
    pin: undefined,
    onChange: () => {},
    onClose: () => {}
};

export const PINConfirmationProvider = ({ children }: PINConfirmationProviderProps) => {
    const [
        { isOpen, isLoading, pin, title, action, onChange, onClose, state },
        _setState
    ] = useState(initialState);

    const setState = (value: Partial<ConfirmationState>) => {
        _setState(oldValue => ({ ...oldValue, ...value }));
    };

    const reset = () => {
        onClose();
        setState(initialState);
    };

    const onChangeState = (state: "success" | "failure" | undefined) => {
        setState({ state });
    };
    // TODO fix and make confirmation page
    return (
        <>
            {isOpen && (
                <PINConfirmation
                    pin={pin}
                    isLoading={isLoading}
                    onChangeState={onChangeState}
                    onBack={reset}
                    state={state}
                    onChange={onChange}
                    title={title}
                    action={action}
                />
            )}
            <confirmationContext.Provider
                value={{
                    setState,
                    reset,
                    isOpen,
                    isLoading
                }}
            >
                <div style={{ display: isOpen ? "none" : undefined }}>{children}</div>
            </confirmationContext.Provider>
        </>
    );
};
