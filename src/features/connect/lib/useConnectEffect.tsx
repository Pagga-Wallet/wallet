import { initData, useSignal } from "@telegram-apps/sdk-react";
import { useEffect, useMemo } from "react";
import { useGetConnectionsQuery } from "@/entities/connection";
import { useOpenConnect } from "../model/connectService";
import { parseStartParams } from "./parseStartParams";

export const useConnectEffect = () => {
    const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const { connect } = useOpenConnect();

    const { data: connections, isLoading: isLoadingConnections } = useGetConnectionsQuery({});

    const startParam = useSignal(initData.startParam);

    useEffect(() => {
        try {
            const id = urlSearch.get("id");
            const version = urlSearch.get("v");
            const request = urlSearch.get("r");
            const strategy = urlSearch.get("ret");

            if (id && version && request) {
                connect({
                    id,
                    version,
                    request,
                    strategy,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [urlSearch]);

    useEffect(() => {
        // console.log("connections", connections);
        if (!startParam) {
            return;
        }
        if (isLoadingConnections) {
            return;
        }
        try {
            const { strategy, request, version, id } = parseStartParams(startParam);
            // console.log("connect with startParam", {
            //     id,
            //     version,
            //     request,
            //     strategy,
            // });

            const existConnection = connections?.find(
                (connection: any) => connection.clientSessionId === id
            );

            if (!existConnection) {
                connect({
                    id,
                    version,
                    request,
                    strategy,
                });
            }
        } catch (err) {
            console.error("connect with startParam error", err);
        }
    }, [initData, isLoadingConnections, connections]);
};
