/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useIsPendingMutation = (endpointName: string) => {
    const api = useSelector((state: any) => state.multichainAccountApi);
    const isFetching = useMemo(
        () =>
            Object.values(api.mutations).some(
                (mutation: any) =>
                    mutation.status === "pending" && mutation.endpointName === endpointName
            ),
        [api, endpointName]
    );
    return isFetching;
};
