import { FC } from "react";
import { TransactionDetailsModal } from "@/features/modal";
import { TransactionHistoryListItem } from "@/entities/transaction";
import s from "./TransactionsHistoryList.module.scss";

interface TransactionHistoryListProps {}

export const TransactionsHistoryList: FC<TransactionHistoryListProps> = () => {
    return (
        <div className={s.transactionsHistory}>
            {/* <div className={s.period}>
                <div className={s.date}>Сегодня, Ср</div>
                <div className={s.list}>
                    <TransactionHistoryListItem
                        actionType="Вызов контракта"
                        address="UQBo176Xk_xHKS9v3zOvK4QDWcvu02hO7QY36C7M8g0H7kb5"
                        amount={5.12}
                        chain="TON"
                        status="Recieved"
                        key={1}
                        modalComponent={<TransactionDetailsModal onClose={() => {}} />}
                    />
                    <TransactionHistoryListItem
                        actionType="Вызов контракта"
                        address="UQBo176Xk_xHKS9v3zOvK4QDWcvu02hO7QY36C7M8g0H7kb5"
                        amount={5.12}
                        chain="TON"
                        status="Recieved"
                        modalComponent={<TransactionDetailsModal onClose={() => {}} />}
                    />
                </div>
            </div>
            <div className={s.period}>
                <div className={s.date}>Вчера, Вт</div>
                <div className={s.list}>
                    <TransactionHistoryListItem
                        actionType="Вызов контракта"
                        address="UQBo176Xk_xHKS9v3zOvK4QDWcvu02hO7QY36C7M8g0H7kb5"
                        amount={5.12}
                        chain="TON"
                        status="Recieved"
                        modalComponent={<TransactionDetailsModal onClose={() => {}} />}
                    />
                </div>
            </div> */}
        </div>
    );
};
