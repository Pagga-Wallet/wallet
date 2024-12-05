/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useIsFetchingQuery = (endpointName: string) => {
    const api = useSelector((state: any) => state.multichainAccountApi);
    const isFetching = useMemo(
        () =>
            Object.values(api.queries).some(
                (query: any) => query.status === "pending" && query.endpointName === endpointName
            ),
        [api, endpointName]
    );
    return isFetching;
};
