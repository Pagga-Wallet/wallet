import { FC } from "react";

interface TransactionIconProps {
    id: string;
}

export const TransactionIconSelector: FC<TransactionIconProps> = ({ id }) => {
    switch (id) {
        case "send":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="41"
                    viewBox="0 0 40 41"
                    fill="none"
                >
                    <path
                        d="M0 20.5C0 9.45431 8.95431 0.5 20 0.5C31.0457 0.5 40 9.45431 40 20.5C40 31.5457 31.0457 40.5 20 40.5C8.95431 40.5 0 31.5457 0 20.5Z"
                        fill="white"
                        fill-opacity="0.06"
                    />
                    <path
                        d="M20 27.375V13.625"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M14.375 19.25L20 13.625L25.625 19.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "receive":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="41"
                    viewBox="0 0 40 41"
                    fill="none"
                >
                    <path
                        d="M0 20.5C0 9.45431 8.95431 0.5 20 0.5C31.0457 0.5 40 9.45431 40 20.5C40 31.5457 31.0457 40.5 20 40.5C8.95431 40.5 0 31.5457 0 20.5Z"
                        fill="white"
                        fill-opacity="0.06"
                    />
                    <path
                        d="M20 13.625V27.375"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M14.375 21.75L20 27.375L25.625 21.75"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
    }
};
