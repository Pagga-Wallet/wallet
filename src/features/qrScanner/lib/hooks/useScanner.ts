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

        // HTTPS URLs
        if (content?.startsWith("https://")) {
            const urlSearch = new URLSearchParams(new URL(content).search);
        
            // Получаем параметр startattach
            const startAttach = urlSearch.get("startattach");
            if (startAttach && startAttach.startsWith("tonconnect-v__")) {
                const regex = /tonconnect-v__(\d+)-id__([^-\s]+)-r__(.*)-(ret__([^-\s]+))?/;
                const match = startAttach.match(regex);
        
                if (match) {
                    const version = match[1];
                    const id = match[2];
                    const rawRequest = match[3];
                    const strategy = match[5];
        
                    console.log("Raw request before decoding:", rawRequest);
        
                    let request;
                    try {
                        // Нормализуем строку, заменив '--' на '%'
                        let normalizedString = rawRequest.replace(/--/g, "%");
                        console.log("Normalized string:", normalizedString);
        
                        if (!normalizedString.endsWith('}')) {
                            console.warn("Warning: Raw request might be incomplete.", normalizedString);
                            normalizedString += "}";
                        }
        
                        const cleanedString = normalizedString.replace(/-+$/, "");
                        console.log("Cleaned string:", cleanedString);
        
                        let decodedString;
                        try {
                            decodedString = decodeURIComponent(cleanedString);
                            console.log("Decoded string:", decodedString);
                        } catch (decodeError) {
                            console.error("Decoding failed:", decodeError);
                            return qrScanner.close();
                        }
        
                        if (decodedString.endsWith("-}")) {
                            decodedString = decodedString.slice(0, -2) + "}";
                        }
        
                        if (!decodedString || decodedString.trim() === "") {
                            console.error("Decoded string is empty or invalid JSON:", decodedString);
                            return qrScanner.close();
                        }
        
                        try {
                            request = JSON.parse(decodedString);
                            console.log("Parsed request object:", request);
                        } catch (jsonError) {
                            console.error("Failed to parse JSON:", jsonError);
                            return qrScanner.close();
                        }
                    } catch (error) {
                        console.error("General error in processing:", {
                            rawRequest,
                            error,
                        });
                        return qrScanner.close();
                    }

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
            }
        
            console.log("No valid parameters found in the link.");
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
            navigate(`/send?receiver=${content}`);
        }
        
        qrScanner.close();
        // Else
        return content
    }, [connect, qrScanner, navigate]);
    return [scanHandle];
};
