/* eslint-disable boundaries/element-types */
import { useInitData } from "@tma.js/sdk-react";
import { FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line boundaries/element-types
import { ConnectWalletModal } from "@/features/modal";
import {
    multichainAccountStore,
    useFetchAccountsQuery,
    useLazyLoadAccountQuery,
} from "@/entities/multichainAccount";
import VerticalDotsIcon from "@/shared/assets/vertical-dots.svg?react";
import { Emoji } from "@/shared/components";
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
    const tgData = useInitData();
    const navigate = useNavigate();

    const [isConnectWalletOpen, setIsConnectWalletOpen] = useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const onSetupAccount = (id: string) => {
        navigate(`/account/${id}`);
    };

    const onSwitchAccount = (id: string) => {
        switchAccount(id).then(() => {
            onClose();
        });
    };

    useHandleClickOutside(wrapperRef, () => onClose(), "modal-window");

    const truncateUsername = (username: string, maxLength: number) => {
        if (username.length > maxLength) {
            return username.slice(0, maxLength) + "...";
        }
        return username;
    };

    return (
        <div ref={wrapperRef} className={s.wrapper}>
            {isConnectWalletOpen && (
                <ConnectWalletModal onClose={() => setIsConnectWalletOpen(false)} />
            )}
            <div className={s.top}>
                <div className={s.user} onClick={onClose}>
                    <img
                        src={`https://t.me/i/userpic/320/${tgData?.user?.username}.jpg`}
                        alt={tgData?.user?.username}
                        className={s.userAvatar}
                    />
                    <div className={s.userName}>
                        {truncateUsername(tgData?.user?.username ?? "User", 10)}
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
                            {account.name || `Кошелек ${parseInt(account.id) + 1}`}
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
    );
};
