import { resolve } from "path";
import replace from "@rollup/plugin-replace";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        mkcert(),
        nodePolyfills(),
        svgr(),
        replace({
            delimiters: ["", ""],
            preventAssignment: true,
            values: {
                'if (typeof module === "object" && typeof module.exports === "object") {':
                    'if (typeof module === "object" && typeof module.exports === "object" && typeof module.exports.default === "object") {',
            },
        }),
        ...(mode === "development" ? [mkcert()] : []),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    server: {
        host: "192.168.1.111",
        port: 3000,
        https: mode === "development" ? {} : undefined,
    },
    preview: {
        host: "192.168.1.111",
        port: 3000,
        https: undefined,
    },
}));
