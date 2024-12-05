import { initBiometryManager } from "@tma.js/sdk";
import React from "react";
import { useLazyVerifyPINQuery } from "@/entities/multichainAccount";
import { useStrictContext } from "@/shared/lib/react";
import { useGetUseBiometryQuery } from "../model/confirmationService";
import { confirmationContext } from "./context";

interface ConfirmOptions {
    title: string;
    action?: React.ReactNode;
}

export const usePINConfirmation = () => {
    const { setState, reset, isOpen } = useStrictContext(confirmationContext);
    const [verifyPIN] = useLazyVerifyPINQuery();
    const { data: isUseBiometry } = useGetUseBiometryQuery();
    const [biometryManagerInit] = initBiometryManager();

    const confirmViaBiometry = () =>
        new Promise<string>((internalResolve, internalReject) => {
            biometryManagerInit
                .then(async (bm) => {
                    try {
                        await bm.requestAccess({ reason: "Use biometry authenticate" });
                        const pin = await bm.authenticate({ reason: "PIN confirmation" });
                        if (!pin) {
                            return internalReject("Invalid PIN");
                        }
                        setState({
                            pin,
                        });
                        const isValidPIN = await verifyPIN(pin).unwrap();
                        if (!isValidPIN) {
                            return internalReject("Invalid PIN");
                        }
                        setState({
                            state: "success",
                            isLoading: true,
                        });
                        internalResolve(pin);
                    } catch {
                        internalReject();
                    }
                })
                .catch(() => {
                    internalReject();
                });
        });

    const confirmViaPIN = () =>
        new Promise<string>((internalResolve, internalReject) => {
            setState({
                onChange: async (pinCode: string) => {
                    if (pinCode.length === 4) {
                        try {
                            const isValidPIN = await verifyPIN(pinCode).unwrap();
                            if (isValidPIN) {
                                setState({ state: "success", isLoading: true });
                                internalResolve(pinCode); // Resolve the promise with the valid PIN after delay
                            } else {
                                setState({ state: "failure" });
                                // reject(new Error("Invalid PIN")); // Reject the promise with invalid PIN error
                            }
                        } catch (error) {
                            setState({ state: "failure" });
                            // reject(error); // Reject the promise with verification error
                        }
                    }
                },
                onClose: () => internalReject(new Error("Reject Confirmation")),
            });
        });

    const confirm = async ({ title, action }: ConfirmOptions): Promise<string> => {
        return new Promise((resolve, reject) => {
            reset();
            setState({
                isOpen: true,
                title,
                action,
            });
            if (isUseBiometry) {
                confirmViaBiometry()
                    .then((pin) => {
                        setTimeout(() => {
                            resolve(pin);
                            reset();
                        }, 1000);
                    })
                    .catch(() => {
                        confirmViaPIN()
                            .then((pin) => {
                                setTimeout(() => {
                                    resolve(pin);
                                    reset();
                                }, 1000);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    });
            } else {
                confirmViaPIN()
                    .then((pin) => {
                        setTimeout(() => {
                            resolve(pin);
                            reset();
                        }, 1000);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    };

    return {
        confirm,
        isOpen,
    };
};
