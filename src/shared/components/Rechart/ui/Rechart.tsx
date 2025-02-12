import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AreaChart, Tooltip, YAxis, Area, ResponsiveContainer } from "recharts";
import { ChangeValue } from "@/shared/components";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { TokenPriceHistory } from "@/shared/lib/types";
import styles from "./Chart.module.scss";

interface ChartProps {
    points: TokenPriceHistory;
    currentPrice: number;
    priceChange: number;
}

// export const formatNumLabelYAxis = (num: number, fixed: number, fixedLessOne?: boolean) => {
//     if (Number(num) < 1 && Number(num) > -1 && fixedLessOne) {
//         const arrPrecisionNumber = num.toString().split("e");
//         if (arrPrecisionNumber.length > 1) {
//             const numberOfZero = arrPrecisionNumber[1];
//             const integerNumber = Number(Math.abs(+arrPrecisionNumber[0]));
//             const arrOfZero = new Array(Math.abs(+numberOfZero || 0))?.fill(0);
//             arrOfZero[arrOfZero?.length - 1] = integerNumber.toFixed();
//             const firstNum = num > 0 ? "0." : "-0.";
//             arrOfZero.unshift(firstNum);
//             return arrOfZero.join("");
//         }
//         const arrNumbers =
//             num
//                 .toString()
//                 .split(".")?.[1]
//                 ?.split("") || [];
//         const indexNumber = arrNumbers.findIndex(num => +num > 0);

//         const result = Number(num).toFixed(indexNumber + (fixed || 0));
//         if (result[result.length - 1] === "0") {
//             return result.slice(0, -1);
//         }

//         return result;
//     }
//     if (num === null || num === undefined || (!Number(num) && Number(num) !== 0)) return "-";
//     const number = Number(num).toFixed(fixed);
//     const arr = number.split(".");
//     let int = arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     if (num >= 1000000 && num < 1000000000) {
//         const intK = arr[0].replace(/\d{3}$/g, "K");
//         int = intK.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     }

//     if (num >= 1000000000 && num <= 1000000000000) {
//         const intM = arr[0].replace(/\d{6}$/g, "M");
//         int = intM.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     }

//     if (num >= 1000000000000) {
//         const intG = arr[0].replace(/\d{9}$/g, "T");
//         int = intG.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     }
//     if (arr[1] !== undefined) {
//         arr[1] = arr[1].replace(/0*$/, "");
//     }
//     if (arr[1] !== undefined && arr[1].trim() !== "") {
//         return int + "." + arr[1];
//     } else {
//         return int;
//     }
// };

// export const CustomizedAxisTickY = (props: any) => {
//     const { x, y, payload, setWidthForYAxios } = props;
//     const value =
//         formatNumLabelYAxis(payload.value, 9) === "0"
//             ? formatNumLabelYAxis(payload.value, 9)
//             : formatNumLabelYAxis(payload.value, 3, true);
//     !!setWidthForYAxios && setWidthForYAxios(value);

//     return (
//         <g transform={`translate(${x},${y})`}>
//             <text
//                 y={0}
//                 textAnchor="start"
//                 fill="var(--text-lighter)"
//                 style={
//                     props.fontSize
//                         ? {
//                               fontFamily: "Inter",
//                               fontSize: props.fontSize,
//                               fontWeight: "500",
//                               lineHeight: "18px"
//                           }
//                         : { fontFamily: "Inter", fontSize: "10px", fontWeight: "400" }
//                 }
//             >
//                 {value}
//             </text>
//         </g>
//     );
// };

export const Rechart: FC<ChartProps> = ({ points, currentPrice, priceChange }) => {
    const { t } = useTranslation();

    const parsedPoints = points.map(([timestamp, value]) => ({
        value: value,
        category: timestamp
    }));
    console.log(parsedPoints);

    // if (currentPrice === 0) {
    //     return <></>;
    // }

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <span className={styles.price}>${formatNumber(currentPrice)}</span>
                <ChangeValue percent value={priceChange} />
            </div>
            {points?.length < 1 ? (
                <div className={styles.empty}>{t("common.no-charts-data")}</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%" className={styles.responsContainer}>
                    <AreaChart
                        data={parsedPoints}
                        margin={{
                            bottom: 5,
                            top: 5,
                            left: 5,
                            right: 5
                        }}
                    >
                        {/* <defs>
                            <linearGradient id={colorId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={stopColor} stopOpacity={0.5} />
                                {!noChanges && (
                                    <stop offset="110%" stopColor={stopColor} stopOpacity={0} />
                                )}
                                {noChanges && (
                                    <stop offset="110%" stopColor={stopColor} stopOpacity={0.5} />
                                )}
                            </linearGradient>
                        </defs> */}
                        <YAxis
                            type="number"
                            stroke="#8884d8"
                            // stroke="var(--link-active-color)"
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                            // stroke={strokeColor}
                            fillOpacity={1}
                            // fill={`url(#${colorId})`}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};
