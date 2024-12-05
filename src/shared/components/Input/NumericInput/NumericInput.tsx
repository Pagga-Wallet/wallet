import { CSSProperties, FC, useEffect, useState } from "react";

import { scientificToDecimal } from "@/shared/lib/helpers/scientificToDecimal";
import { BaseInput } from "../BaseInput";

interface INumericInput {
    className?: string;
    style?: CSSProperties;
    initialValue?: number;
    onChange: (value: number) => void;
    maxDecimals?: number;
    value: string;
    disabled?: boolean;
}

export const NumericInput: FC<INumericInput> = ({
    onChange,
    maxDecimals = 9,
    className,
    style,
    value,
    disabled = false,
}) => {
    const [state, setState] = useState<string>(value.toString());

    const changeHandler = (value: string) => {
        if (+scientificToDecimal(+value) < 0.00001) {
            setState("0");
            return;
        }
        let inputValue = value.replace(/,/g, ".");
        inputValue = inputValue.replace(/^0+(?!$|\.)/, "");
        inputValue = inputValue.replace(/[^0-9.]+/, "");
        inputValue = inputValue.length === 0 ? "0" : inputValue;
        const parsedInput = parseFloat(inputValue);
        const isOverMaxDecimals =
            inputValue.split(".").length > 1 && inputValue.split(".")[1].length > maxDecimals;
        const isValidInput =
            /^-?\d*\.?\d*$/.test(inputValue) && !isNaN(parsedInput) && !isOverMaxDecimals;
        if (isValidInput) {
            setState(inputValue);
            onChange(parsedInput);
        }
    };

    useEffect(() => {
        if (parseFloat(value) !== parseFloat(state)) setState(value.toString());
    }, [value]);

    return (
        <BaseInput
            pattern="[0-9]*[.,]?[0-9]*"
            onChange={changeHandler}
            inputMode="decimal"
            value={state}
            className={className as string}
            style={style}
            disabled={disabled}
        />
    );
};
