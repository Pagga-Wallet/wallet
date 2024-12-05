import { toast } from "react-toastify";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { sendNotification } from "@/shared/lib/helpers/sendNotification";
import s from "./CopyField.module.scss";

interface CopyFieldProps {
    text: string;
    alertText: string;
}

export const CopyField = ({ text, alertText }: CopyFieldProps) => {
    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // toast.success(alertText, { theme: "light" });
                sendNotification(alertText, "success");
            })
            .catch(() => {
                sendNotification("Failed to copy", "error");
            });
    };

    return (
        <div className={s.copyField} onClick={copyToClipboard}>
            <div className={s.circle}></div>
            <div className={s.text}>{text}</div>
            <button className={s.btn}>
                <SvgSelector id="copy" />
            </button>
        </div>
    );
};
