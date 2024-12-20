import { initBiometryManager } from "@tma.js/sdk";
import { useHapticFeedback } from "@tma.js/sdk-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useChangePIN, usePINConfirmation } from "@/features/PIN";
import {
    useGetUseBiometryQuery,
    useSetUseBiometryMutation,
} from "@/features/PIN/PINConfirmation/model/confirmationService";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { Section, Container } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";
import { useSetupBackButton } from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

export const SettingsPage = () => {
    const {
        t,
        i18n: { changeLanguage, language },
    } = useTranslation();
    const hapticApi = useHapticFeedback();
    const { confirm } = usePINConfirmation();
    const navigate = useNavigate();
    const { data: isUsedBiometry, isFetching: isFetchingBiometry } = useGetUseBiometryQuery();
    const [setUseBiometry, { isLoading: isSettingBiometry }] = useSetUseBiometryMutation();
    const [biometryManagerInit] = initBiometryManager();
    const { changePIN } = useChangePIN();

    useSetupBackButton();

    const onResetData = async () => {
        hapticApi.impactOccurred("medium");
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
                title: t("pincode.enter"),
            });
            const bm = await biometryManagerInit;
            await bm.requestAccess({ reason: "" });
            await bm.updateToken({ token: pin });
        }
        setUseBiometry(value);
    };

    return (
        <PrivateLayout>
            <Container>
                <Section title={t("settings.title")} icon={<SvgSelector id="settings-icon" />}>
                    <Section.Link to="/ton-version">{t("settings.ton-version")}</Section.Link>
                    <Section.Button onClick={onResetData} danger>
                        {t("settings.reset")}
                    </Section.Button>
                </Section>
                <Section title={t("settings.security")} icon={<SvgSelector id="security-icon" />}>
                    <Section.Switch
                        disabled={isFetchingBiometry || isSettingBiometry}
                        onChange={onChangeUseBiometry}
                        value={isUsedBiometry}
                    >
                        {t("settings.use-biometry")}
                    </Section.Switch>
                    <Section.Button onClick={changePIN}>
                        {t("settings.change-password")}
                    </Section.Button>
                </Section>
                <Section icon={<SvgSelector id="apps-icon" />} title="dApps">
                    {/* <Section.Link disabled to="">
                        Wallet Connect
                    </Section.Link> */}
                    <Section.Link oneElement to="/connect/wallet-connect-list">
                        TON Connect
                    </Section.Link>
                </Section>
                <Section icon={<SvgSelector id="language" />} title={t("settings.language")}>
                    <Section.Radio
                        checked={language === "ru"}
                        onSelect={() => {
                            onChangeLang("ru");
                        }}
                    >
                        Русский
                    </Section.Radio>
                    <Section.Radio
                        checked={language === "en"}
                        onSelect={() => {
                            onChangeLang("en");
                        }}
                    >
                        English
                    </Section.Radio>
                </Section>
            </Container>
        </PrivateLayout>
    );
};
