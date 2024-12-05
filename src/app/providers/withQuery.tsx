import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

export const withQuery = (component: () => React.ReactNode) => () => {
    return <QueryClientProvider client={queryClient}>{component()}</QueryClientProvider>;
};
