import { backButton } from "@telegram-apps/sdk-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { NftSendStatus } from "@/widgets/nft";
import { ConfirmSendTransactionInfo, InputMemo, SelectWalletToSend } from "@/widgets/transaction";
import { usePINConfirmation } from "@/features/PIN";
import { useFetchTotalBalanceQuery, useSendNFTMutation } from "@/entities/multichainAccount";
import { useFetchNFTDetailsQuery } from "@/entities/nft/model/nftAPI";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";

import { checkAddress } from "@/shared/lib/helpers/checkAddress";

import { CHAINS } from "@/shared/lib/types";

import { btnText, titles } from "../lib/consts";
import { SendNftSteps } from "../lib/types";

import s from "./NftSendPage.module.sass";

export const NftSendPage = () => {
    const { state } = useLocation();
    const [step, setStep] = useState<SendNftSteps>(SendNftSteps.SelectAddress);
    const [receiver, setReceiver] = useState<string>("");
    const [memo, setMemo] = useState<string>("");
    const [parsedReceiver, setParsedReceiver] = useState<string>("");

    const { t } = useTranslation();
    const { data: nft } = useFetchNFTDetailsQuery({
        address: state.address,
    });
    const [sendNFT] = useSendNFTMutation();
    const navigate = useNavigate();

    const { data: accountBalance = null, isFetching: accountBalanceFetching } =
        useFetchTotalBalanceQuery();
    // Валидация

    const [disableBtn, errorText] = useMemo(() => {
        let result = false;
        let text = "";

        switch (step) {
            case SendNftSteps.SelectAddress:
                if (!receiver) {
                    result = true;
                    text = t("send.select-recipient");
                } else if (!parsedReceiver) {
                    result = true;
                    text = t("send.invalid-receiver");
                }
                break;
            case SendNftSteps.Confirm:
                if ((accountBalance?.chains?.TON?.nativeToken?.balance ?? 0) < 0.1) {
                    result = true;
                    text = t("common.insufficient-funds-ton");
                } else if (accountBalanceFetching) {
                    result = true;
                }
                break;
            default:
                break;
        }

        return [result, text];
    }, [step, receiver, parsedReceiver, t, accountBalance, accountBalanceFetching]);

    useEffect(() => {
        const check = async () => {
            const parsed = await checkAddress(receiver, CHAINS.TON);
            setParsedReceiver(parsed ?? "");
        };

        check();
    }, [receiver]);

    const handleResetStates = () => {
        setReceiver("");
        setMemo("");
        setParsedReceiver("");
    };

    const onBack = useCallback(() => {
        switch (step) {
            case SendNftSteps.SelectAddress:
                navigate(-1);
                break;
            case SendNftSteps.EnterMemo:
                setStep(SendNftSteps.SelectAddress);
                break;
            case SendNftSteps.Confirm:
                setStep(SendNftSteps.EnterMemo);
                break;
            case SendNftSteps.Success:
                navigate("/home");
                break;
            case SendNftSteps.Failed:
                setStep(SendNftSteps.SelectAddress);
                handleResetStates();
                break;
            default:
                break;
        }
    }, [step, navigate]);

    // Так как после ввода пинкода скрывалася кнопка
    backButton.show();

    useSetupBackButton({
        onBack,
    });

    const { confirm, isOpen } = usePINConfirmation();

    const onSend = useCallback(async () => {
        try {
            const pin = await confirm({
                title: t("pincode.enter"),
            });
            const res = await sendNFT({
                address: state.address,
                receiverAddress: parsedReceiver,
                pin,
                memo,
            });
            setStep(SendNftSteps.Success);
        } catch {
            setStep(SendNftSteps.Failed);
        }
    }, [state, memo, receiver, parsedReceiver]);

    const onForward = useCallback(async () => {
        switch (step) {
            case SendNftSteps.SelectAddress:
                return setStep(SendNftSteps.EnterMemo);
            case SendNftSteps.EnterMemo:
                return setStep(SendNftSteps.Confirm);
            case SendNftSteps.Confirm:
                return onSend();
            case SendNftSteps.Success:
                navigate("/home");
                break;
            case SendNftSteps.Failed:
                setStep(SendNftSteps.SelectAddress);
                handleResetStates();
                break;
            default:
                break;
        }
    }, [step, navigate, onSend]);

    useSetupMainButton({
        onClick: onForward,
        params: {
            text: errorText || t(btnText[step]),
            isVisible: !isOpen,
            isEnabled: !disableBtn,
            isLoaderVisible: false,
        },
    });

    return (
        <BaseLayout>
            {step !== SendNftSteps.Failed && step !== SendNftSteps.Success && (
                <Title className={s.title}>{t(titles[step])}</Title>
            )}
            {step === SendNftSteps.SelectAddress && (
                <SelectWalletToSend tokenSelected={null} value={receiver} setValue={setReceiver} />
            )}
            {step === SendNftSteps.EnterMemo && <InputMemo value={memo} setValue={setMemo} />}
            {step === SendNftSteps.Confirm && (
                <ConfirmSendTransactionInfo
                    tokenSymbol={nft!.name}
                    receiver={receiver}
                    memo={memo}
                />
            )}
            {step === SendNftSteps.Failed && <NftSendStatus status="failed" />}
            {step === SendNftSteps.Success && <NftSendStatus status="success" />}
        </BaseLayout>
    );
};
