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
        case "smart-contract":
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
                        d="M21.875 13V17.375H26.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M21.875 20.5L23.75 22.375L21.875 24.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18.125 20.5L16.25 22.375L18.125 24.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M25.625 28C25.7908 28 25.9497 27.9342 26.0669 27.8169C26.1842 27.6997 26.25 27.5408 26.25 27.375V17.375L21.875 13H14.375C14.2092 13 14.0503 13.0658 13.9331 13.1831C13.8158 13.3003 13.75 13.4592 13.75 13.625V27.375C13.75 27.5408 13.8158 27.6997 13.9331 27.8169C14.0503 27.9342 14.2092 28 14.375 28H25.625Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "swap":
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
                        d="M18.75 24.25L16.25 26.75L13.75 24.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M16.25 14.25V26.75"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M21.25 16.75L23.75 14.25L26.25 16.75"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M23.75 26.75V14.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "refund":
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
                        d="M19.9997 26.7941V14.2941M13.4801 14.25H26.5194C27.1609 14.25 27.5618 14.9444 27.241 15.5L20.7214 26.7923C20.4007 27.3479 19.5988 27.3479 19.278 26.7923L12.7584 15.5C12.4376 14.9444 12.8386 14.25 13.4801 14.25Z"
                        stroke="#7F7F91"
                        stroke-width="1.5"
                    />
                </svg>
            );
        case "burn":
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
                        d="M18.75 18L20.8023 12.375C22.4891 13.775 26.25 17.3867 26.25 21.75C26.25 23.4076 25.5915 24.9973 24.4194 26.1694C23.2473 27.3415 21.6576 28 20 28C18.3424 28 16.7527 27.3415 15.5806 26.1694C14.4085 24.9973 13.75 23.4076 13.75 21.75C13.75 19.3617 14.8766 17.1984 16.1719 15.5L18.75 18Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "jetton-mint":
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
                        d="M18.125 28C20.5412 28 22.5 24.6421 22.5 20.5C22.5 16.3579 20.5412 13 18.125 13C15.7088 13 13.75 16.3579 13.75 20.5C13.75 24.6421 15.7088 28 18.125 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18.125 13H21.875C24.2914 13 26.25 16.3594 26.25 20.5C26.25 24.6406 24.2914 28 21.875 28H18.125"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M21.3857 15.5H25.1357"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M22.5 20.5H26.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M21.3857 25.5H25.1357"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "subscribe":
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
                        d="M20 16.125V17.375"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 23.625V24.875"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 28C24.1421 28 27.5 24.6421 27.5 20.5C27.5 16.3579 24.1421 13 20 13C15.8579 13 12.5 16.3579 12.5 20.5C12.5 24.6421 15.8579 28 20 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18.125 23.625H20.9375C21.3519 23.625 21.7493 23.4604 22.0424 23.1674C22.3354 22.8743 22.5 22.4769 22.5 22.0625C22.5 21.6481 22.3354 21.2507 22.0424 20.9576C21.7493 20.6646 21.3519 20.5 20.9375 20.5H19.0625C18.6481 20.5 18.2507 20.3354 17.9576 20.0424C17.6646 19.7493 17.5 19.3519 17.5 18.9375C17.5 18.5231 17.6646 18.1257 17.9576 17.8326C18.2507 17.5396 18.6481 17.375 19.0625 17.375H21.875"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "unsubscribe":
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
                        d="M25.3035 25.803L14.6973 15.1968"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 28C24.1421 28 27.5 24.6421 27.5 20.5C27.5 16.3579 24.1421 13 20 13C15.8579 13 12.5 16.3579 12.5 20.5C12.5 24.6421 15.8579 28 20 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-miterlimit="10"
                    />
                </svg>
            );
        case "auction-bid":
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
                        d="M18.4375 19.5625L20.9375 22.0625"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M27.8172 18.3079L24.6875 21.4375"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M13.1251 15.5L14.2009 14.3883C14.8393 13.7498 15.5972 13.2433 16.4314 12.8977C17.2656 12.5521 18.1597 12.3743 19.0626 12.3743C19.9655 12.3743 20.8596 12.5521 21.6938 12.8977C22.528 13.2433 23.2859 13.7498 23.9243 14.3883L29.1923 19.6922C29.3094 19.8094 29.3752 19.9683 29.3752 20.134C29.3752 20.2997 29.3094 20.4586 29.1923 20.5758L26.9532 22.8172C26.836 22.9343 26.6771 23.0001 26.5114 23.0001C26.3457 23.0001 26.1868 22.9343 26.0696 22.8172L23.1251 19.875L15.1829 27.8172C15.0657 27.9343 14.9068 28.0001 14.7411 28.0001C14.5754 28.0001 14.4165 27.9343 14.2993 27.8172L12.6829 26.2031C12.5658 26.0859 12.5 25.927 12.5 25.7613C12.5 25.5956 12.5658 25.4367 12.6829 25.3195L20.6251 17.375L16.2329 12.9828"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "stake":
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
                        d="M20 28C24.1421 28 27.5 24.6421 27.5 20.5C27.5 16.3579 24.1421 13 20 13C15.8579 13 12.5 16.3579 12.5 20.5C12.5 24.6421 15.8579 28 20 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M17.5 19.875L20 17.375L22.5 19.875"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 23.625V17.375"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "unstake":
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
                        d="M20 28C24.1421 28 27.5 24.6421 27.5 20.5C27.5 16.3579 24.1421 13 20 13C15.8579 13 12.5 16.3579 12.5 20.5C12.5 24.6421 15.8579 28 20 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M17.5 21.125L20 23.625L22.5 21.125"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 17.375V23.625"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "domain-renewal":
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
                        d="M12.5 20.5H27.5"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 28C24.1421 28 27.5 24.6421 27.5 20.5C27.5 16.3579 24.1421 13 20 13C15.8579 13 12.5 16.3579 12.5 20.5C12.5 24.6421 15.8579 28 20 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M23.125 20.5C23.125 25.5 20 28 20 28C20 28 16.875 25.5 16.875 20.5C16.875 15.5 20 13 20 13C20 13 23.125 15.5 23.125 20.5Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
        case "unknown":
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
                        d="M20.875 24.5625C20.875 25.0457 20.4832 25.4375 20 25.4375C19.5168 25.4375 19.125 25.0457 19.125 24.5625C19.125 24.0793 19.5168 23.6875 20 23.6875C20.4832 23.6875 20.875 24.0793 20.875 24.5625Z"
                        fill="#7F7F91"
                        stroke="#7F7F91"
                        stroke-width="0.125"
                    />
                    <path
                        d="M20 21.75V21.125C21.3805 21.125 22.5 20.1453 22.5 18.9375C22.5 17.7297 21.3805 16.75 20 16.75C18.6195 16.75 17.5 17.7297 17.5 18.9375V19.25"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M20 28C24.1421 28 27.5 24.6421 27.5 20.5C27.5 16.3579 24.1421 13 20 13C15.8579 13 12.5 16.3579 12.5 20.5C12.5 24.6421 15.8579 28 20 28Z"
                        stroke="#7F7F91"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            );
    }
};
