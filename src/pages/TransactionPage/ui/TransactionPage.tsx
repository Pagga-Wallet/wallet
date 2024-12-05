import { initUtils } from "@tma.js/sdk";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MultichainAccount, multichainAccountStore } from "@/entities/multichainAccount";
import { transactionStore } from "@/entities/transaction/model/transactionSlice";
import ArrowDownIcon from "@/shared/assets/arrow-down.svg?react";
import ArrowUpIcon from "@/shared/assets/arrow-up.svg?react";
import { AmountFormat, CardDetails, Title } from "@/shared/components";
import { Text } from "@/shared/components";
import { networkLabels } from "@/shared/config";
import { BaseLayout } from "@/shared/layouts";
import { useAppSelector, useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import { formatNumber, formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { getExplorerLink } from "@/shared/lib/helpers/getExplorerLink";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import styles from "./TransactionPage.module.scss";

export const TransactionPage = () => {
    const { t } = useTranslation();
    const utils = initUtils();

    const { hash, memo, amountUSD, direction, chain, timestamp, amount, symbol, from, to, fee } =
        useAppSelector(transactionStore.selectors.selectDetails);
    const currentAccount = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);

    const multichainAccount = useMemo(
        () => (currentAccount ? new MultichainAccount(currentAccount, tonVersion) : undefined),
        [currentAccount, tonVersion]
    );

    const handleNavigate = useCallback(() => {
        const link = getExplorerLink({
            userAddress: multichainAccount!.getAddressInNetwork(chain),
            txHash: hash,
            chain,
        });
        utils.openLink(link);
    }, [multichainAccount, hash, chain, utils]);

    useSetupBackButton();

    useSetupMainButton({
        onClick: handleNavigate,
        params: {
            text: t("trans-detail.view-btn"),
            textColor: "#FFFFFF",
            isLoaderVisible: false,
            bgColor: "#007AFF",
            isEnabled: true,
            isVisible: true,
        },
    });

    return (
        <BaseLayout className={styles.wrapper}>
            <div>
                <Title>{direction === "OUT" ? t("history.sent") : t("history.received")}</Title>
                {timestamp && (
                    <Text size="small" type="secondary">
                        {dayjs(+timestamp).format("DD/MM, HH:mm")}
                    </Text>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.icon}>
                    {direction === "OUT" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>
                <div>
                    <AmountFormat
                        className={styles.amount}
                        value={+formatTokenAmount(amount.toString())}
                    />{" "}
                    <Text type="secondary" className={styles.symbol}>
                        {symbol}
                    </Text>
                </div>
                {/*<Text type="secondary">≈ ${formatNumber(amountUSD)}</Text>*/}
            </div>

            <CardDetails
                sections={[
                    {
                        title: t("trans-detail.title"),
                        properties: [
                            {
                                name: t("trans-detail.network"),
                                value: networkLabels[chain],
                            },
                            {
                                name:
                                    direction === "OUT"
                                        ? t("trans-detail.recipient")
                                        : t("trans-detail.sender"),
                                value: smallAddress(direction === "OUT" ? to : from),
                            },
                            // {
                            //     name: t("trans-detail.fee"),
                            //     value: fee?.toString(),
                            // },
                            {
                                name: t("trans-detail.memo"),
                                value: memo,
                            },
                        ],
                    },
                ]}
            />
        </BaseLayout>
    );
};
