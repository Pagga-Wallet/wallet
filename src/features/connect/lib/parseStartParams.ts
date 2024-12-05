import { QueryConnect } from "@/shared/lib/types/connect";

export const parseStartParams = (startParams: string): QueryConnect & { strategy?: string } => {
    const regex = /tonconnect-v__(\d+)-id__([^-]+)-r__(.*?)(?:-ret__([^\s]+))?$/;
    const match = startParams.match(regex);

    if (!match) {
        throw new Error("Invalid start params.");
    }

    const version = match[1];
    const id = match[2];
    const request = match[3];

    let strategy = match[4];

    if (strategy) {
        strategy = decodeURIComponent(strategy.replace(/--/g, "%"));
    }

    return {
        version,
        id,
        request,
        strategy,
    };
};
