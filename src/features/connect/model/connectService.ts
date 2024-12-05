import { useNavigate } from "react-router-dom";
import { useAddConnectionMutation } from "@/entities/connection";
import { multichainAccountStore } from "@/entities/multichainAccount";
import { useAction, useAppSelector } from "@/shared/lib";
import { TonConnectRemoteBridge } from "@/shared/lib/connect/TonConnectRemoteBridge";
import { QueryConnect } from "@/shared/lib/types/connect";
import { connectStore } from "./connectSlice";

export const useOpenConnect = () => {
    const navigate = useNavigate();
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const setConnectParams = useAction(connectStore.actions.setConnectionParams);
    const [addConnection] = useAddConnectionMutation();

    const connect = (query: QueryConnect) => {
        TonConnectRemoteBridge.handleConnectDeeplink(
            query,
            () => {
                navigate("/connect/open");
            },
            ({ manifest, replyBuilder, requestPromise }) => {
                setConnectParams({
                    manifest,
                    replyBuilder,
                    requestPromise,
                });
            },
            account!.id,
            async (connection) => {
                await addConnection(connection);
            }
        );
    };

    return { connect };
};
