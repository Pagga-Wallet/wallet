import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput, Container, Emoji, EmojiList, Section, Title } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { IMultichainAccount } from "@/shared/lib/types";
import styles from "./WalletPage.module.scss";

interface AccountEditFormProps {
    account: IMultichainAccount;
    onChange: (payload: { emojiId: string; name: string }) => void;
    onDelete: () => void;
}

export const AccountEditForm = ({ account, onChange, onDelete }: AccountEditFormProps) => {
    const { t } = useTranslation();

    const [emojiId, setEmojiId] = useState<number>(parseInt(account.emojiId || "0"));
    const [name, setName] = useState(
        account.name || t("wallet.default-name", { id: `${parseInt(account.id) + 1}` })
    );

    const onSelectEmoji = (id: number) => {
        setEmojiId(id);
        onChange({
            emojiId: id.toString(),
            name,
        });
    };

    const onChangeName = (value: string) => {
        setName(value);
        onChange({
            name: value,
            emojiId: emojiId.toString(),
        });
    };

    return (
        <Container>
            <Title>{name || t("wallet.default-name", { id: `${parseInt(account.id) + 1}` })}</Title>
            <Section title={t("common.title")} className={styles.name_section}>
                <Emoji id={emojiId || 0} />
                <BaseInput
                    maxLength={16}
                    value={name}
                    onChange={onChangeName}
                    className={styles.name_input}
                />
                <div className={styles.name_sectionCloseBtn} onClick={() => setName("")}>
                    <SvgSelector id="close" />
                </div>
            </Section>
            <Section className={styles.sectionEmoji}>
                <EmojiList value={emojiId} onSelect={onSelectEmoji} />
            </Section>
            <Section>
                <Section.Link to="recovery">{t("wallet.show-recovery-phrase")}</Section.Link>
                <Section.Button danger onClick={onDelete}>
                    {t("wallet.deletion")}
                </Section.Button>
            </Section>
        </Container>
    );
};
