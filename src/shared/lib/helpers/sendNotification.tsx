import { toast, ToastOptions, Slide } from "react-toastify";
import { Toast } from "@/shared/components/";

const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 1200,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    transition: Slide,
    rtl: false,
    closeButton: false,
};

declare type ToastType = "info" | "success" | "error";

export const sendNotification = (message: string, type: ToastType) => {
    toast(<Toast message={message} type={type} />, toastOptions);
};
