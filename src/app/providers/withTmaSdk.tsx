import { SDKProvider } from "@tma.js/sdk-react";
import React from "react";

export const withTmaSdk = (component: () => React.ReactNode) => () => {
    return <SDKProvider acceptCustomStyles>{component()}</SDKProvider>;
};
