import { FC } from "react";
import { v1 } from "uuid";

import { ConnectItem, SkeletonItemSkeleton } from "@/features/connect";

import { IConnectionWithWalletName } from "@/entities/connection/model/types";
import { Title } from "@/shared/components";

import { SkeletonRound } from "@/shared/components/Skeletons";
import { ConnectionType } from "@/shared/lib/types/connect";


import s from "./ConnectList.module.sass";

interface ConnectListProps {
    connections: IConnectionWithWalletName[] | undefined;
    onClick: (clientSessionId: string) => void;
    isLoading: boolean;
}

export const ConnectList: FC<ConnectListProps> = ({ onClick, connections, isLoading }) => {
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
                <div className={s.group}>
                    {connections?.map(c => (
                        <ConnectItem
                            key={v1()}
                            title={c.name}
                            preview={c.iconUrl}
                            onClick={() => onClick(c.clientSessionId)}
                            isActions
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
