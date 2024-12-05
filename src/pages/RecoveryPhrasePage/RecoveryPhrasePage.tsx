import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { usePINConfirmation } from "@/features/PIN";
import { useFetchAccountQuery } from "@/entities/multichainAccount";
import { WordArea } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";
import { cryptographyController, useSetupBackButton } from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { sendNotification } from "@/shared/lib/helpers/sendNotification";

export const RecoveryPhrasePage = () => {
    const { id } = useParams();
    const { data: account, isFetching } = useFetchAccountQuery(id as string);
    const { confirm } = usePINConfirmation();
    const navigate = useNavigate();
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const { t } = useTranslation();

    const onBack = useCallback(() => {
        navigate(-1);
    }, []);

    useSetupBackButton();

    useEffect(() => {
        if (!isFetching && account) {
            confirm({
                title: t("pincode.enter"),
            })
                .then((pin) => {
                    const result = cryptographyController.HashToKey(
                        pin,
                        account!.masterIV,
                        account!.masterHash
                    );
                    if (result) {
                        setMnemonic(result.split(" "));
                    }
                })
                .catch(() => {
                    navigate(-1);
                });
        }
    }, [isFetching, account]);

    return (
        <PrivateLayout>
            <WordArea
                title={t("settings.title")}
                disabled
                value={mnemonic}
                buttonProps={{
                    icon: <SvgSelector id="copy" />,
                    children: t("common.copy"),
                    onClick: (_, words) => {
                        navigator.clipboard.writeText(words.join(" "));
                        sendNotification(t("common.mnemonics-copied"), "success");
                    },
                }}
            />
        </PrivateLayout>
    );
};
