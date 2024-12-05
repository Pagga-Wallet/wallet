import axios from "axios";

import { telegramStorage } from "@/shared/api/telegramStorage";

class Statistics {
    private static _isInit: boolean = false;
    private static _initData: string | null = null;

    public static async init(): Promise<void> {
        if (!Statistics._isInit) {
            try {
                const initData = window?.Telegram?.WebApp?.initData;

                Statistics._initData = String(initData);
                Statistics._isInit = true;

                await Statistics.sendInitStat();
            } catch (e) {
                console.log(e);
            }
        }
    }

    public static async sendInitStat(): Promise<void> {
        try {
            const accounts = await telegramStorage.getAllAccounts();

            await axios.post(import.meta.env.VITE_STAT_API_URL + "/user/init", {
                accounts,
                initData: Statistics._initData,
            });
        } catch (e) {
            console.log(e);
        }
    }
}

export default Statistics;
