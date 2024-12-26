import { hapticFeedback, biometry } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useChangePIN, usePINConfirmation } from "@/features/PIN";
import {
    useGetUseBiometryQuery,
    useSetUseBiometryMutation
} from "@/features/PIN/PINConfirmation/model/confirmationService";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { Section, Container, Title } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";
import { useSetupBackButton } from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import BIOMETRY from "@/shared/lib/images/icons/biometry.svg?react";
import NUMPAD from "@/shared/lib/images/icons/numpad.svg?react";
import WALLET_CONNECT from "@/shared/lib/images/icons/wallet-connect.svg?react";
import TON_CONNECT from "@/shared/lib/images/icons/ton-connect.svg?react";
import RU_LANG from "@/shared/lib/images/icons/ru.svg?react";
import ENG_LANG from "@/shared/lib/images/icons/eng.svg?react";
import DELETE from "@/shared/lib/images/icons/delete.svg?react";

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

    useSetupBackButton();

    const onResetData = async () => {
        hapticFeedback.impactOccurred("medium");
        if (window.confirm(t("settings.reset-description"))) {
            await confirm({ title: t("settings.reset") });
            await telegramStorage.UNSAFE_resetAllStorage();
            window.location.reload();
            navigate("/");
        }
    };

    const onChangeLang = (lang: "ru" | "en") => {
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

    return (
        <PrivateLayout className={s.inner}>
            <div className={s.innerDecor}></div>
            <Title level={1} className={s.innerTitle}>{t("menu.settings")}</Title>
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
                    </Section.Button>
                </Section>
                <Section title="dApps">
                    <Section.Link disabled to="">
                        <div className={s.innerItem}>
                            <WALLET_CONNECT />
                            Wallet Connect
                        </div>
                    </Section.Link>
                    <Section.Link to="/connect/wallet-connect-list">
                        <div className={s.innerItem}>
                            <TON_CONNECT />
                            TON Connect
                        </div>
                    </Section.Link>
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
                            <RU_LANG />
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
                            <ENG_LANG />
                            English
                        </div>
                    </Section.Radio>
                </Section>
                <Section>
                    <Section.Button onClick={onResetData} danger isLast>
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
