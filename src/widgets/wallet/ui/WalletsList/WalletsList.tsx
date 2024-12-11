import { initData, useSignal } from "@telegram-apps/sdk-react";
import clsx from "clsx";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConnectWalletModal } from "@/features/modal";
import {
    multichainAccountStore,
    useFetchAccountsQuery,
    useLazyLoadAccountQuery,
} from "@/entities/multichainAccount";
import { MAX_USER_WALLETS } from "@/shared/api/telegramStorage/lib/consts";
import VerticalDotsIcon from "@/shared/assets/vertical-dots.svg?react";

import { Avatar, Emoji } from "@/shared/components";
import { useAppSelector } from "@/shared/lib";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import { useHandleClickOutside } from "@/shared/lib/hooks";

import s from "./WalletsList.module.scss";

interface WalletsList {
    onClose: () => void;
}

export const WalletsList: FC<WalletsList> = ({ onClose }) => {
    const { data: accounts } = useFetchAccountsQuery();
    const [switchAccount] = useLazyLoadAccountQuery();
    const currentAccount = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const user = useSignal(initData.user);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isConnectWalletOpen, setIsConnectWalletOpen] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClose = () => {
        containerRef.current?.classList.add(s["container--close"]);
        setTimeout(() => {
            onClose();
        }, 420);
    };

    const onSetupAccount = (id: string) => {
        navigate(`/account/${id}`);
    };

    const onSwitchAccount = (id: string) => {
        switchAccount(id).then(() => {
            handleClose();
        });
    };

    useHandleClickOutside(containerRef, () => handleClose(), "modal-window");

    const truncateUsername = (username: string, maxLength: number) => {
        if (username.length > maxLength) {
            return username.slice(0, maxLength) + "...";
        }
        return username;
    };
    console.log(accounts);

    const calculateMaxHeight = (length: number) => {
        switch (length) {
            case 1:
                return "140px";
            case 2:
                return "205px";
            case 3:
                return "265px";
            case 4:
                return "325px";
            case 5:
                return "385px";
            default:
                return "385px";
        }
    };

    return (
        <div className={s.wrapperBg}>
            <div
                ref={containerRef}
                className={clsx(s.container)}
                style={{
                    maxHeight: calculateMaxHeight(accounts?.length ?? 1),
                }}
            >
                {isConnectWalletOpen && (
                    <ConnectWalletModal onClose={() => setIsConnectWalletOpen(false)} />
                )}
                <div className={s.top}>
                    {(accounts?.length || 0) < MAX_USER_WALLETS ? (
                        <div className={s.plus} onClick={() => setIsConnectWalletOpen(true)}>
                            <SvgSelector id="plus" />
                        </div>
                    ) : (
                        <div className={s.plusHide}></div>
                    )}
                    <div className={s.user} onClick={handleClose}>
                        <Avatar />
                        <div className={s.userName}>
                            {truncateUsername(user?.username ?? "User", 10)}
                        </div>
                        <button className={s.arrow}>
                            <SvgSelector id="chevron-top" />
                        </button>
                    </div>
                </div>
                <div className={s.wallets}>
                    {accounts?.map((account: any) => (
                        <button
                            className={s.wallet}
                            key={account.id}
                            onClick={() => onSwitchAccount(account.id)}
                        >
                            {currentAccount?.id === account.id && (
                                <span className={s.checked}>
                                    <SvgSelector id="checked" />
                                </span>
                            )}
                            <span className={s.walletTitle}>
                                {account.name ||
                                    t("main.wallet", { id: parseInt(account?.id || "0") + 1 })}
                            </span>
                            <div className={s.wallet__actions}>
                                <span className={s.wallet__emoji}>
                                    <Emoji id={account.emojiId} />
                                </span>
                                <button
                                    className={s.wallet__dots}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSetupAccount(account.id);
                                    }}
                                >
                                    <VerticalDotsIcon />
                                </button>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
