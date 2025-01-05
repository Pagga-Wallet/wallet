import { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
    MultichainAccount,
    multichainAccountStore,
    useGetLastTxsByTokenQuery,
} from "@/entities/multichainAccount";

import {
    TransactionHistoryDetailItem,
    TransactionHistoryDetailItemSkeleton,
} from "@/entities/transaction";
import { transactionStore } from "@/entities/transaction/model/transactionSlice";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { CHAINS, TokenBalance } from "@/shared/lib/types";
import { BaseTxnParsed, TxnDirection } from "@/shared/lib/types/transaction";
import s from "./TransactionsHistoryListDetail.module.sass";

interface TransactionsHistoryListDetailProps {
    token: TokenBalance;
}

export const TransactionsHistoryListDetail: FC<TransactionsHistoryListDetailProps> = ({
    token,
}) => {
    const { t } = useTranslation();

    const { data: lastTxs, isLoading } = useGetLastTxsByTokenQuery(token);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onOpenDetails = useCallback(
        (tx: BaseTxnParsed) => {
            dispatch(transactionStore.actions.setDetails(tx));
            navigate("/transaction");
        },
        [navigate]
    );

    const renderSkeletons = () =>
        new Array(10).fill(null).map(() => <TransactionHistoryDetailItemSkeleton key={uuidv4()} />);

    const renderEmptyMessage = () => (
        <div className={s.empty}>{t("send.send-to-position.no-recent")}</div>
    );

    const renderTransactionItem = (tx: BaseTxnParsed) => (
        <TransactionHistoryDetailItem
            actionType={tx.actionType}
            txHash={tx.hash}
            amount={tx.amount}
            symbol={tx.symbol}
            direction={tx.direction}
            key={tx.hash}
            timestamp={tx.timestamp}
            onClick={() => onOpenDetails(tx)}
            participantAddress={tx.direction === "OUT" ? tx.to : tx.from}
        />
    );

    return (
        <div className={s.transactionsHistory}>
            {isLoading
                ? renderSkeletons()
                : !lastTxs?.items?.length
                ? renderEmptyMessage()
                : lastTxs.items.map(renderTransactionItem)}
        </div>
    );
};
