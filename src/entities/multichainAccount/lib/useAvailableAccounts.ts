import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { telegramStorage } from "@/shared/api/telegramStorage";

export const useAvailableAccounts = () => {
    const [loading, setLoading] = useState(true);
    const [lastAccId, setLastAccId] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        telegramStorage
            .getLastUsedAccountId()
            .then(async (res) => {
                if (res) {
                    setLastAccId(res);
                    return navigate("/home");
                }
                if (!res) {
                    // const isOnboarded = await telegramStorage.getIsOnboarded();
                    // if (isOnboarded === "true") {
                    //     return navigate("/");
                    // }
                    // if (!isOnboarded || isOnboarded === "false") {
                    //     return navigate("/introduction");
                    // }
                    return navigate("/");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {
        loading,
        lastAccId,
    };
};
