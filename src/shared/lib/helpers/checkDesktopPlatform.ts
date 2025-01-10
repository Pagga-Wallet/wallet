declare global {
    interface MainButtonParams {
        text?: string;
        color?: string;
        text_color?: string;
        is_active?: boolean;
        is_visible?: boolean;
    }
    interface MainButton {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        isProgressVisible: boolean;
        setText: (text: string) => void;
        onClick: (cb: VoidFunction) => void;
        offClick: (cb: VoidFunction) => void;
        show: VoidFunction;
        hide: VoidFunction;
        enable: VoidFunction;
        disable: VoidFunction;
        showProgress: (leaveActive?: boolean) => void;
        hideProgress: VoidFunction;
        setParams: (params: MainButtonParams) => void;
    }
    interface TelegramWebApp {
        [x: string]: any;
        initData: string;
        platform: string;
        MainButton: MainButton;
        onEvent: any;
        offEvent: any;
        close: VoidFunction;
        openLink: (link: string) => void;
        openTelegramLink: (link: string) => void;
    }

    interface Telegram {
        WebApp: TelegramWebApp;
    }

    interface Window {
        Telegram: Telegram;
    }
}

export const checkDesktopPlatform = (): boolean => {
    if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
        return window.Telegram.WebApp.platform === "tdesktop";
    }

    return false;
};
