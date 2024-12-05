import { ReactNode } from "react";
import { createStrictContext } from "@/shared/lib/react";

export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    action: ReactNode | null;
    state?: "success" | "failure" | undefined;
    onChange: (pinCode: string) => void;
    onClose: () => void;
    pin: string | undefined;
    isLoading: boolean;
}

interface ConfirmationContext {
    setState: (state: Partial<ConfirmationState>) => void;
    reset: () => void;
    isOpen: boolean;
    isLoading: boolean;
}
export const confirmationContext = createStrictContext<ConfirmationContext>();
