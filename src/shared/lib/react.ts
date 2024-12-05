import { Context, createContext, useContext } from "react";

export function useStrictContext<T>(context: Context<T | null>) {
    const value = useContext(context);
    if (value === null) throw new Error("Strict context not passed");
    return value as T;
}

export function createStrictContext<T>() {
    return createContext<T | null>(null);
}
