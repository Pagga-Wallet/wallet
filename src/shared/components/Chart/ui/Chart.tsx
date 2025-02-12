import {
    createChart,
    LineData,
    DeepPartial,
    TimeChartOptions,
    AreaStyleOptions,
    SeriesOptionsCommon,
    Time
} from "lightweight-charts";
import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChangeValue } from "@/shared/components";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { TokenPriceHistory } from "@/shared/lib/types";
import { areaSeriesConfig, chartConfig, themesData } from "../consts/config";
import styles from "./Chart.module.scss";

interface ChartProps {
    points: TokenPriceHistory;
    selectedLanguage?: string;
    currentPrice: number;
    priceChange: number;
}

export const Chart: FC<ChartProps> = ({
    points,
    selectedLanguage = "en",
    currentPrice,
    priceChange
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    useEffect(() => {
        if (points.length < 1) return;

        const sortedData = Array.from(points).sort((a, b) => a[0] - b[0]);

        const chartOptions: DeepPartial<TimeChartOptions> = {
            ...chartConfig,
            localization: { locale: selectedLanguage }
        };

        const chartContainer = chartContainerRef.current;

        if (!chartContainer) return;

        const chart = createChart(chartContainer as HTMLDivElement, chartOptions);

        const resizeChart = () => {
            const containerWidth = chartContainer?.getBoundingClientRect()?.width || 0;
            const aspectRatio = 0.75;

            chart.resize(containerWidth, containerWidth * aspectRatio);
        };
        window.addEventListener("resize", resizeChart);
        resizeChart();

        const areaSeries = chart.addAreaSeries({
            ...areaSeriesConfig,
            lineColor: priceChange > 0 ? "rgba(84, 255, 144, 1)" : "rgba(255, 28, 69, 1)",
            bottomColor: "transparent",
            topColor: priceChange > 0 ? "rgba(84, 255, 144, 1)" : "rgba(255, 28, 69, 1)"
        });

        const syncToTheme = (theme: keyof typeof themesData) => {
            chart.applyOptions(themesData[theme].layout as DeepPartial<TimeChartOptions>);
            areaSeries.applyOptions(
                themesData[theme] as DeepPartial<AreaStyleOptions & SeriesOptionsCommon>
            );
        };
        syncToTheme("Dark");

        const data: LineData[] = sortedData.map(el => ({
            time: (+new Date(el[0]) / 1000) as Time,
            value: el[1] as number
        }));
        areaSeries.setData(data);
        chart.timeScale().fitContent();

        return () => {
            window.removeEventListener("resize", resizeChart);
            chart.remove();
        };
    }, [JSON.stringify(points), selectedLanguage, chartContainerRef.current, priceChange]);

    if (currentPrice === 0) {
        return <></>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <span className={styles.price}>${formatNumber(currentPrice)}</span>
                <ChangeValue percent value={priceChange} />
            </div>
            {points?.length < 1 ? (
                <div className={styles.empty}>{t("common.no-charts-data")}</div>
            ) : (
                <div ref={chartContainerRef} style={{ width: "100%", maxWidth: "100%" }} />
            )}
        </div>
    );
};
