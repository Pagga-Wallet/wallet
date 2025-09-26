import { hapticFeedback, biometry, openPopup } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v1 } from "uuid";

import { useChangePIN, usePINConfirmation } from "@/features/PIN";
import {
    useGetUseBiometryQuery,
    useSetUseBiometryMutation
} from "@/features/PIN/PINConfirmation/model/confirmationService";
import { multichainAccountStore, useSwitchTonVersionMutation } from "@/entities/multichainAccount";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { TonWalletService } from "@/shared/api/ton";
import { Section, Container, Title } from "@/shared/components";
import { TonVersion } from "@/shared/components/TonVersion/TonVersion";
import { PrivateLayout } from "@/shared/layouts";
import { WithDecorLayout } from "@/shared/layouts/layouts";
import { useAppSelector, useSetupBackButton } from "@/shared/lib";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import BIOMETRY from "@/shared/lib/images/icons/biometry.svg?react";

import DELETE from "@/shared/lib/images/icons/delete.svg?react";
import LOCK from "@/shared/lib/images/icons/lock.svg?react";
import NUMPAD from "@/shared/lib/images/icons/numpad.svg?react";
import TON_CONNECT from "@/shared/lib/images/icons/ton-connect.svg?react";
import WALLET_CONNECT from "@/shared/lib/images/icons/wallet-connect.svg?react";
import { TON_ADDRESS_INTERFACES } from "@/shared/lib/types";

import s from "./SettingPage.module.sass";

export const SettingsPage = () => {
    const {
        t,
        i18n: { changeLanguage, language }
    } = useTranslation();
    const { confirm } = usePINConfirmation();
    const navigate = useNavigate();
    const { data: isUsedBiometry, isFetching: isFetchingBiometry } = useGetUseBiometryQuery();
    const [setUseBiometry, { isLoading: isSettingBiometry }] = useSetUseBiometryMutation();
    const { changePIN } = useChangePIN();

    const currentAccount = useAppSelector(multichainAccountStore.selectors.selectAccount);

    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const [switchTonVersion, { isLoading: isLoadingVersion }] = useSwitchTonVersionMutation();

    useSetupBackButton();

    const onResetData = () => {
        openPopup({
            title: t("settings.reset"),
            message: t("settings.reset-description"),
            buttons: [
                {
                    id: "del-btn",
                    type: "default",
                    text: t("common.continue")
                },
                { id: "cancel", type: "cancel" }
            ]
        }).then(async buttonId => {
            if (buttonId !== "cancel") {
                hapticFeedback.impactOccurred("medium");

                await confirm({ title: t("settings.reset") });
                await telegramStorage.UNSAFE_resetAllStorage();
                window.location.reload();
                navigate("/");
            }
        });
    };

    // Force reset without PIN or confirmation
    const onForceResetData = async () => {
        try {
            hapticFeedback.impactOccurred("medium");
            await telegramStorage.UNSAFE_resetAllStorage();
            window.location.reload();
            navigate("/");
        } catch (e) {
            // no-op
        }
    };

    const onChangeLang = (lang: "ru" | "en" | "ua") => {
        changeLanguage(lang).then(() => {
            localStorage.setItem("lang", lang);
        });
    };

    const onChangeUseBiometry = async (value: boolean) => {
        if (value) {
            const pin = await confirm({
                title: t("pincode.enter")
            });
            await biometry.requestAccess({ reason: "" });
            await biometry.updateToken({ token: pin });
        }
        setUseBiometry(value);
    };

    const interfaces = Object.values(TON_ADDRESS_INTERFACES);

    const onSwitchVersion = (version: TON_ADDRESS_INTERFACES) => {
        if (tonVersion !== version) switchTonVersion(version);
    };

    return (
        <PrivateLayout withDecor className={s.inner}>
            <Title level={1} className={s.innerTitle}>
                {t("menu.settings")}
            </Title>
            <Container className={s.innerContent}>
                {/* <Section title={t("settings.title")}>
                    <Section.Link to="/ton-version">{t("settings.ton-version")}</Section.Link>
                </Section> */}
                <Section title={t("settings.security")}>
                    <Section.Switch
                        disabled={isFetchingBiometry || isSettingBiometry}
                        onChange={onChangeUseBiometry}
                        value={isUsedBiometry}
                    >
                        <div className={s.innerItem}>
                            <BIOMETRY />
                            {t("settings.use-biometry")}
                        </div>
                    </Section.Switch>
                    <Section.Button onClick={changePIN}>
                        <div className={s.innerItem}>
                            <NUMPAD />
                            {t("settings.change-password")}
                        </div>
                        <SvgSelector id="chevron-right-gray" />
                    </Section.Button>

                    <Section.Link to={`/account/${currentAccount?.id}/recovery`}>
                        <div className={s.innerItem}>
                            <LOCK />
                            {t("settings.show-recovery-phrase")}
                        </div>
                    </Section.Link>
                </Section>
                <Section title="dApps">
                    <Section.Link to="/connect/wallet-connect-list/wallet-connect">
                        <div className={s.innerItem}>
                            <WALLET_CONNECT />
                            Wallet Connect
                        </div>
                    </Section.Link>
                    <Section.Link to="/connect/wallet-connect-list/ton-connect">
                        <div className={s.innerItem}>
                            <TON_CONNECT />
                            TON Connect
                        </div>
                    </Section.Link>
                </Section>
                <Section title={t("settings.ton-version")}>
                    {interfaces.map(i => (
                        <Section.Radio
                            checked={tonVersion === i}
                            onSelect={() => onSwitchVersion(i)}
                            disabled={isLoadingVersion}
                            withoutCheckbox
                        >
                            <div className={s.innerVersion}>
                                {smallAddress(
                                    TonWalletService.createWalletByVersion(
                                        i,
                                        currentAccount?.multiwallet?.TON.publicKey!
                                    ).address.toString({ bounceable: false })
                                )}
                                <TonVersion version={i} />
                            </div>
                        </Section.Radio>
                    ))}
                </Section>
                <Section title={t("settings.language")}>
                    <Section.Radio
                        checked={language === "ru"}
                        onSelect={() => {
                            onChangeLang("ru");
                        }}
                        withoutCheckbox
                    >
                        <div className={s.innerItem}>
                            <SvgSelector id="ru-lang" />
                            Русский
                        </div>
                    </Section.Radio>
                    <Section.Radio
                        checked={language === "en"}
                        onSelect={() => {
                            onChangeLang("en");
                        }}
                        withoutCheckbox
                    >
                        <div className={s.innerItem}>
                            <SvgSelector id="eng-lang" />
                            English
                        </div>
                    </Section.Radio>
                    <Section.Radio
                        checked={language === "ua"}
                        onSelect={() => {
                            onChangeLang("ua");
                        }}
                        withoutCheckbox
                    >
                        <div className={s.innerItem}>
                            <SvgSelector id="ua-lang" />
                            Українська
                        </div>
                    </Section.Radio>
                </Section>
                <Section title="Pagga Wallet, 2025">
                    <Section.Link to="">
                        <div className={s.innerItem}>
                            <SvgSelector id="telegram" />
                            {t("common.telegram-channel")}
                        </div>
                    </Section.Link>
                    <Section.Link to="">
                        <div className={s.innerItem}>
                            <SvgSelector id="support" />
                            {t("common.support")}
                        </div>
                    </Section.Link>
                </Section>
                <Section>
                    <Section.Button onClick={onForceResetData} danger>
                        <div className={s.innerItem}>
                            <DELETE />
                            Force reset (no PIN)
                        </div>
                    </Section.Button>
                    <Section.Button onClick={onResetData} danger>
                        <div className={s.innerItem}>
                            <DELETE />
                            {t("settings.reset")}
                        </div>
                    </Section.Button>
                </Section>
            </Container>
        </PrivateLayout>
    );
};
