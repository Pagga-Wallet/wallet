import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCreateAccountMutation } from "@/entities/multichainAccount";
import { Modal } from "@/shared/components/Modal/Modal";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import s from "./ConnectWalletModal.module.scss";

interface ConnectWalletModal {
    onClose: () => void;
}

export const ConnectWalletModal: FC<ConnectWalletModal> = ({ onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [createAccount, { isLoading: createAccountLoading }] = useCreateAccountMutation();

    const onCreate = async () => {
        const data = await createAccount().unwrap();
        navigate("/create/mnemonic", {
            state: {
                ...data,
            },
        });
    };

    const onRecovery = () => {
        navigate("/import/mnemonic");
    };

    return (
        <Modal onClose={onClose}>
            <>
                <div className={s.title}>{t("connect-wallet.title")}</div>
                <div className={s.description}>{t("connect-wallet.method")}</div>
                <div className={s.actions}>
                    <button
                        className={s.actionButton}
                        disabled={createAccountLoading}
                        onClick={onCreate}
                    >
                        <span className={s.actionButton__icon}>
                            <SvgSelector id="plus" />
                        </span>
                        <div>
                            <div className={s.actionButton__title}>
                                {t("connect-wallet.create-new")}
                            </div>
                            <div className={s.actionButton__description}>
                                {t("connect-wallet.seed")}
                            </div>
                        </div>
                    </button>
                    <button className={s.actionButton} onClick={onRecovery}>
                        <span className={s.actionButton__icon}>
                            <SvgSelector id="plus" />
                        </span>
                        <div>
                            <div className={s.actionButton__title}>
                                {t("connect-wallet.add-existing")}
                            </div>
                            <div className={s.actionButton__description}>
                                {t("connect-wallet.recovery")}
                            </div>
                        </div>
                    </button>
                </div>
            </>
        </Modal>
    );
};
