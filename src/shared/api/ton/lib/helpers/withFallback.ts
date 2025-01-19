import { TonClient4 } from "@ton/ton";
import { tonClient4 } from "@/shared/api/tonapi";

export type Method<T extends any[], R> = (client: TonClient4, ...args: T) => Promise<R>;

export const withFallback = async <T extends any[], R>(
    method: Method<T, R>,
    ...args: T
): Promise<R> => {
    try {
        // console.log("Trying primary client:", method.name);
        // return await method(tonClient4Delab, ...args);
        return await method(tonClient4, ...args);
    } catch (error) {
        console.error("Error with primary client:", method.name, error);
        console.log("Trying backup client:", method.name);
        try {
            return await method(tonClient4, ...args);
        } catch (secondError) {
            console.error("Error with backup client as well:", method.name, secondError);
            throw secondError;
        }
    }
};
