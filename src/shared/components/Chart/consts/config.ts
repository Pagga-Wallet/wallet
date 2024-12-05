import {
    AreaSeriesPartialOptions,
    ColorType,
    DeepPartial,
    TimeChartOptions,
} from "lightweight-charts";

const darkTheme = {
    layout: {
        backgroundColor: "red",
        lineColor: "#2B2B43",
        textColor: "#D9D9D9",
    },
    watermark: { color: "rgba(0, 0, 0, 0)" },
    crosshair: { color: "#758696" },
    grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#363C4E" },
    },
};

const lightTheme = {
    layout: {
        backgroundColor: "red",
        lineColor: "#2B2B43",
        textColor: "#191919",
    },
    watermark: { color: "rgba(0, 0, 0, 0)" },
    grid: {
        vertLines: { visible: false },
        horzLines: { color: "#f0f3fa" },
    },
};

export const themesData = {
    Dark: darkTheme,
    Light: lightTheme,
};

export const chartConfig: DeepPartial<TimeChartOptions> = {
    rightPriceScale: { borderVisible: false },
    timeScale: { borderVisible: false },
    layout: {
        background: {
            type: ColorType.Solid,
            color: "transparent",
        },
        textColor: "#8A97AA",
        fontSize: 12,
    },
    crosshair: {
        vertLine: {
            width: 4,
            color: "rgba(224, 227, 235, 0.1)",
            style: 0,
        },
        horzLine: {
            visible: true,
            labelVisible: true,
        },
    },
    grid: {
        vertLines: { color: "rgba(42, 46, 57, 0)" },
        horzLines: { color: "rgba(42, 46, 57, 0)" },
    },
};

export const areaSeriesConfig: AreaSeriesPartialOptions = {
    topColor: "rgba(33, 150, 243, 0.56)",
    bottomColor: "rgba(33, 150, 243, 0.04)",
    lineColor: "rgba(33, 150, 243, 1)",
    lineWidth: 2,
};
