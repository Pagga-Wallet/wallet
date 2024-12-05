import React from "react";
import { useTranslation } from "react-i18next";
import { multichainAccountStore, useSwitchTonVersionMutation } from "@/entities/multichainAccount";
import { TonWalletService } from "@/shared/api/ton";
import { Container, Section } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";
import { useAppSelector, useSetupBackButton } from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import { TON_ADDRESS_INTERFACES } from "@/shared/lib/types";
import s from "./ChangeTonVersion.module.sass";

export const ChangeTonVersion = () => {
    const { t } = useTranslation();
    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const [switchTonVersion, { isLoading }] = useSwitchTonVersionMutation();
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);
    useSetupBackButton();

    const interfaces = Object.values(TON_ADDRESS_INTERFACES);

    const onSwitch = (version: TON_ADDRESS_INTERFACES) => {
        if (tonVersion !== version) switchTonVersion(version);
    };

    return (
        <PrivateLayout>
            <Container>
                <Section
                    title={t("settings.ton-version")}
                    icon={<SvgSelector id="settings-icon" />}
                >
                    {account &&
                        interfaces.map((el) => (
                            <Section.Radio
                                checked={tonVersion === el}
                                onSelect={() => onSwitch(el)}
                                disabled={isLoading}
                            >
                                <div>
                                    <span className={s.version}>Wallet {el} </span>
                                    <span className={s.address}>
                                        {smallAddress(
                                            TonWalletService.createWalletByVersion(
                                                el,
                                                account?.multiwallet.TON.publicKey
                                            ).address.toString({ bounceable: false })
                                        )}
                                    </span>
                                </div>
                            </Section.Radio>
                        ))}
                </Section>
            </Container>
        </PrivateLayout>
    );
};
