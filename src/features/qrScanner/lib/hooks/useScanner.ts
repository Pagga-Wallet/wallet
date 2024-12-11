import { qrScanner } from "@telegram-apps/sdk-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QueryConnect } from "@/shared/lib/types/connect";

interface QRScannerProps {
    connect: (query: QueryConnect) => void;
}

export const useQRScanner = ({ connect }: QRScannerProps) => {
    const navigate = useNavigate();
    const scanHandle = useCallback(async () => {
        let content = await qrScanner.open({ text: "Scan QR code" });
        if (!content) return qrScanner.close();

        const queryString = content.split("?")[1];
        const urlSearch = new URLSearchParams(queryString);
        const startParamValue = urlSearch.get("startapp");

        // TonConnect
        if (content?.startsWith("tc://")) {
            const id = urlSearch.get("id");
            const version = urlSearch.get("v");
            const request = urlSearch.get("r");
            const strategy = urlSearch.get("ret");

            if (id && version && request) {
                connect({
                    id,
                    version,
                    request,
                    strategy,
                });
            }
            return qrScanner.close();
        }
        // Tonconnect from startParams
        if (startParamValue) {
            const regex = /tonconnect-v__(\d+)-id__([^-\s]+)-r__(.*)-(ret__([^-\s]+))?/;
            const match = startParamValue.match(regex);
            if (match) {
                const version = match[1];
                const id = match[2];
                const request = match[3];
                const strategy = match[5];

                if (id && version && request) {
                    connect({
                        id,
                        version,
                        request,
                        strategy,
                    });
                }
                return qrScanner.close();
            } else return qrScanner.close();
        }
        // Ton
        if (content?.startsWith("ton://")) {
            content = content.replace("ton://transfer/", "");
            return qrScanner.close();
        }
        // Else
        navigate(`/send?receiver=${content}`);
        return qrScanner.close();
    }, [connect, qrScanner, navigate]);
    return [scanHandle];
};
