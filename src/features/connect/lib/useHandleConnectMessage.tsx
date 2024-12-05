import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line boundaries/element-types
import { connectConfirmStore } from "@/features/connect/model/confirmSlice";
import { useGetConnectionsQuery } from "@/entities/connection";
import { multichainAccountStore } from "@/entities/multichainAccount";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SendTonConnectTransactionProps } from "@/shared/lib/connect/models";
import { TonConnectRemoteBridge } from "@/shared/lib/connect/TonConnectRemoteBridge";

export const useHandleConnectMessage = () => {
    const [props, setTonconnectTransactionProps] = useState<
        SendTonConnectTransactionProps | undefined
    >();
    const navigate = useNavigate();
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);

    const { data: connections } = useGetConnectionsQuery(
        account
            ? {
                  accId: account!.id,
              }
            : skipToken
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log({
            connections,
        });
        if (connections && connections.length > 0) {
            TonConnectRemoteBridge.open({
                connections,
                onTransactionConfirm: (props) => {
                    dispatch(
                        connectConfirmStore.actions.setConfirmConnectParams({
                            requestPromise: props.requestPromise,
                            connection: props.connection,
                            messages: props.messages,
                            request: props.request,
                            validUntil: props.valid_until,
                        })
                    );
                    navigate("/connect/confirm");
                },
                setTonconnectTransactionProps,
                connectedApps: [],
                setConnectedApps: () => {},
            });
        }

        return () => {
            TonConnectRemoteBridge.close();
        };
    }, [connections, props]);
};
