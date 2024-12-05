import { createRoot } from "react-dom/client";
import Statistics from "@/shared/statistics";
import App from "./app/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("rootElement is null");
}

Statistics.init();

const root = createRoot(rootElement);
root.render(<App />);
