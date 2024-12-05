import { FC } from "react";
import error from "@/shared/lib/gifs/error.gif";
import moneyGif from "@/shared/lib/gifs/money.gif";
import s from "./CustomTransactionStatus.module.scss";
interface CustomTransactionStatus {
    isSuccess: boolean;
    type: string;
}
export const CustomTransactionStatus: FC<CustomTransactionStatus> = ({ isSuccess }) => {
    if (isSuccess) {
        return (
            <>
                <img src={moneyGif} alt="success" />
                <div className={s.title}>Ваш инвойс успешно создан!</div>
                <div className={s.description}>Перейдите по кнопке и оплатите</div>
            </>
        );
    } else {
        return (
            <>
                <img src={error} alt="notSuccess" />
                <div className={s.title}>Ваш инвойс успешно создан!</div>
                <div className={s.description}>Перейдите по кнопке и оплатите</div>
            </>
        );
    }
};
