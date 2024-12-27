import { FC } from "react";
import { toast } from "react-toastify";
import { Button } from "@/shared/components/";

import s from "./MnemonicsList.module.scss";

interface MnemonicsList {
    mnemonics: string[];
}

export const MnemonicsList: FC<MnemonicsList> = ({ mnemonics }) => {
    const copyHandler = () => {
        // записываем мнемоник в буфер обмена
        navigator.clipboard.writeText(mnemonics.join(" "));
        toast("Mnemonic phrase copied!");
    };

    return (
        <div className={s.mnemonics}>
            <div className={s.title}>Ваши {mnemonics.length} слов</div>
            <div className={s.list}>
                {mnemonics.map((mnemonicWord, index) => (
                    <div className={s.mnemonic} key={mnemonicWord}>
                        {index + 1}. {mnemonicWord}
                    </div>
                ))}
            </div>

            <Button type="grey" onClick={copyHandler}>
                Скопировать
            </Button>
        </div>
    );
};
