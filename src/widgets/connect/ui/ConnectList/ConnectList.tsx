import { FC } from "react";

import { ConnectItem, SkeletonItemSkeleton } from "@/features/connect";

import { IConnection, IConnectionWithWalletName } from "@/entities/connection/model/types";
import { Emoji, Title } from "@/shared/components";

import { SkeletonRound } from "@/shared/components/Skeletons";

import s from "./ConnectList.module.sass";

interface ConnectListProps {
    connections: IConnectionWithWalletName[] | undefined;
    onClick: (clientSessionId: string) => void;
    isLoading: boolean;
}

export const ConnectList: FC<ConnectListProps> = ({ onClick, connections, isLoading }) => {
    const groupedConnections = connections?.reduce((acc, connection) => {
        const { accId, walletFullName } = connection;

        if (!acc[accId]) {
            acc[accId] = { walletFullName, connections: [] };
        }
        acc[accId].connections.push(connection);
        return acc;
    }, {} as Record<string, { walletFullName: string; connections: IConnection[] }>);

    return (
        <div>
            {isLoading ? (
                <div className={s.group}>
                    <Title level={2} className={s.title}>
                        <SkeletonRound customWidth={90} height={25} />
                    </Title>

                    {new Array(4).fill(null).map((_, i) => (
                        <SkeletonItemSkeleton key={i} />
                    ))}
                </div>
            ) : (
                Object.entries(groupedConnections ?? {}).map(
                    ([accId, { walletFullName, connections }]) => (
                        <div key={accId} className={s.group}>
                            <Title level={2} className={s.title}>
                                <Emoji id={+accId} />
                                {walletFullName}
                            </Title>
                            <div className={s.items}>
                                {connections.map((connection) => (
                                    <ConnectItem
                                        key={connection.clientSessionId}
                                        title={connection.name}
                                        preview={connection.iconUrl}
                                        onClick={() => onClick(connection.clientSessionId)}
                                        isActions
                                    />
                                ))}
                            </div>
                        </div>
                    )
                )
            )}
        </div>
    );
};
