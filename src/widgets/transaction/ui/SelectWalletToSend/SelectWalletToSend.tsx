import { uniqBy } from "lodash";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useGetLastTxsByTokenQuery, useGetLastTxsQuery } from "@/entities/multichainAccount";
import { TransactionRecentItem, TransactionRecentItemSkeleton } from "@/entities/transaction";
import { BaseInput } from "@/shared/components/Input";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { TokenBalance, BaseToken } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import s from "./SelectWalletToSend.module.sass";
import { Text } from "@/shared/components";

interface SelectWalletToSendProps {
    value: string;
    setValue: (value: string) => void;
    onAddressSelect?: (value: string) => void;
    tokenSelected: TokenBalance | BaseToken | null;
    disabled?: boolean;
}

export const SelectWalletToSend: FC<SelectWalletToSendProps> = ({
    value,
    setValue,
    onAddressSelect,
    tokenSelected,
    disabled = false,
}) => {
    const { t } = useTranslation();

    const { data: lastTxs, isFetching: isFetchingByToken } = useGetLastTxsByTokenQuery(
        tokenSelected as TokenBalance | BaseToken,
        {
            skip: !tokenSelected,
        }
    );

    const { data: lastTsxByChain, isFetching: isFetchingByChain } = useGetLastTxsQuery(undefined, {
        skip: !!tokenSelected,
    });

    const isLoading = isFetchingByToken || isFetchingByChain;

    const renderSkeletons = () =>
        new Array(5).fill(null).map(() => <TransactionRecentItemSkeleton key={uuidv4()} />);

    const filteredDataOut = uniqBy(
        (lastTxs || lastTsxByChain)?.items?.filter((el) => el.direction === "OUT"),
        "to"
    );

    const renderEmptyMessage = () => (
        <div className={s.empty}>{t("send.send-to-position.no-recent")}</div>
    );

    const renderRecentTransaction = (tx: BaseTxnParsed) => (
        <TransactionRecentItem
            participantAddress={tx.to}
            onClick={() => (onAddressSelect ? onAddressSelect(tx.to) : setValue(tx.to))}
            chain={tx.chain}
            timestamp={tx.timestamp}
        />
    );

    return (
        <div className={s.inner}>
            <div className={s.search}>
                <BaseInput
                    onChange={setValue}
                    value={value}
                    className={s.searchInput}
                    placeholder={t("common.enter-recepients-address")}
                    style={{ textAlign: "center", fontSize: 18, width: "100%" }}
                    disabled={disabled}
                />
                {value.length >= 1 && !disabled && (
                    <button
                        className={s.searchClear}
                        onClick={() => {
                            setValue("");
                        }}
                    >
                        <SvgSelector id="clear" />
                    </button>
                )}
            </div>

            <div className={s.list}>
                <Text className={s.listTitle}>{t("common.latest-addresses")}</Text>
                {isLoading
                    ? renderSkeletons()
                    : !filteredDataOut?.length
                    ? renderEmptyMessage()
                    : filteredDataOut?.map(renderRecentTransaction)}
            </div>
        </div>
    );
};
