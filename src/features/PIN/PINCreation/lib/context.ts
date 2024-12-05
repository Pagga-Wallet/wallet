import { createStrictContext } from "@/shared/lib/react";

export interface PINCreationContext {
    isOpen: boolean;
    open: () => void;
    setListeners: (listeners: { resolve: (pin: string) => void; reject: () => void }) => void;
}

export const pinCreationContext = createStrictContext<PINCreationContext>();
