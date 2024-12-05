import clsx, { ClassValue } from "clsx";
import { FC } from "react";
import { formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { scientificToDecimal } from "@/shared/lib/helpers/scientificToDecimal";

interface Props {
    value: number;
    className?: ClassValue;
}

export const AmountFormat: FC<Props> = ({ value, className }) => {
    function formatSmallNumber(): string | number {
        if (value === 0) return value;

        const number = scientificToDecimal(value);
        if (Number(number) > 0.00001) {
            return formatTokenAmount(number);
        }

        const parts = number.toString().split(".");

        if (!parts || parts.length < 2) {
            return number;
        }

        const [integerPart, decimalPart] = parts;
        let numberOfZeros = 0;

        for (let i = 0; i < decimalPart.length; i++) {
            if (decimalPart[i] !== "0") {
                break;
            }
            numberOfZeros++;
        }

        const significantDigits = decimalPart.slice(numberOfZeros, numberOfZeros + 3);

        if (significantDigits) {
            return `${integerPart},0<sub>${numberOfZeros}</sub>${significantDigits}`;
        } else {
            return `${integerPart},0<sub>${numberOfZeros}</sub>0`;
        }
    }

    return (
        <span
            className={clsx(className)}
            dangerouslySetInnerHTML={{ __html: formatSmallNumber() }}
        />
    );
};
