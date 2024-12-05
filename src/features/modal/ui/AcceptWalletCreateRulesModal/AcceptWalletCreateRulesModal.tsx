import { useMainButton } from "@tma.js/sdk-react";
import { FC, useEffect, useState } from "react";
import { Modal } from "@/shared/components/Modal/Modal";
import s from "./AcceptWalletCreateRulesModal.module.scss";

interface AcceptWalletCreateRulesModal {
    onClose: () => void;
}
export const AcceptWalletCreateRulesModal: FC<AcceptWalletCreateRulesModal> = ({ onClose }) => {
    const acceptButton = useMainButton();

    useEffect(() => {
        acceptButton.setParams({
            text: "Продолжить",
            textColor: "#FFFFFF",
            bgColor: "#007AFF04",
            isEnabled: false,
            isVisible: true,
        });
        return () => {
            acceptButton.hide();
            acceptButton.disable();
        };
    }, []);

    const [rulesAccepted, setRulesAccepted] = useState<number[]>([]);

    const onRuleAcceptClick = (id: number) => {
        if (rulesAccepted.find((ruleId) => ruleId === id)) return;
        setRulesAccepted((prev) => {
            const newArr = [...prev, id];
            if (newArr.length === 3) {
                acceptButton.setParams({
                    text: "Продолжить",
                    textColor: "#FFFFFF",
                    bgColor: "#007AFF",
                    isEnabled: true,
                    isVisible: true,
                });
                acceptButton.on("click", () => {
                    onClose();
                });
            }
            return newArr;
        });
    };
    return (
        <Modal>
            <div className={s.sticker}>STICKER</div>
            <div className={s.title}>Безопасность</div>
            <div className={s.rules}>
                <div className={s.rulesItem} onClick={() => onRuleAcceptClick(1)}>
                    <div className={s.rulesItemCheck}></div>
                    <div className={s.rulesItemDescription}>
                        Сейчас появятся секретные слова. Запишите их в правильном порядке и
                        сохраните в надёжном месте
                    </div>
                </div>
                <div className={s.rulesItem} onClick={() => onRuleAcceptClick(2)}>
                    <div className={s.rulesItemCheck}></div>
                    <div className={s.rulesItemDescription}>
                        Они позволяют получить доступ к кошельку, если вы забудете свой пароль или
                        потеряете доступ к этому устройству.
                    </div>
                </div>
                <div className={s.rulesItem} onClick={() => onRuleAcceptClick(3)}>
                    <div className={s.rulesItemCheck}></div>
                    <div className={s.rulesItemDescription}>
                        Если кто-то увидит эти слова, ваши средства могут быть украдены. Убедитесь,
                        что рядом никого нет!
                    </div>
                </div>
            </div>
        </Modal>
    );
};
