import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AmountFormat, PlatformName, PlatformNameSize, TokenIcon } from "@/shared/components";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { formatNumber, formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { TokenBalance } from "@/shared/lib/types";

import s from "./TokenDetailInfo.module.sass";

interface TokenDetailInfoProps {
    token: TokenBalance;
}

export const TokenDetailInfo: FC<TokenDetailInfoProps> = ({ token }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const onSendClick = () => {
        navigate("/send", {
            state: {
                preselectedToken: token
            }
        });
    };

    return (
        <div className={s.info}>
            <div className={s.main}>
                <div className={s.mainLeft}>
                    <TokenIcon icon={token.tokenIcon} size={64} showChain chain={token.platform} />
                    <div className={s.amount}>
                        <div className={s.mainLeftTop}>
                            <AmountFormat
                                className={s.amountCount}
                                value={+formatTokenAmount(token.balance.toString())}
                            />
                            <p className={s.amountCount}>{token.tokenSymbol}</p>
                        </div>
                        <div className={s.amountPrice}>≈ ${formatNumber(token.balanceUSD)} </div>
                    </div>
                </div>

                <PlatformName chain={token.platform} size={PlatformNameSize.MEDIUM16} />
            </div>
            <div className={s.bottom}>
                {/* <div className={s.action} onClick={() => null}>
                    <button className={s.icon_button} disabled>
                        <SvgSelector id="buy" />
                    </button>
                    <div className={s.title}>{t("main.buy-btn")}</div>
                </div> */}
                {/* <div className={s.action}>
                    <button
                        className={s.icon_button}
                        onClick={() =>
                            navigate(`/swap?network=${token.platform}`, {
                                state: {
                                    input: token,
                                },
                            })
                        }
                    >
                        <SvgSelector id="buy" />
                    </button>
                    <div className={s.title}>{t("main.swap-btn")}</div>
                </div> */}
                <div className={s.action} onClick={onSendClick}>
                    <button className={s.icon_button}>
                        <SvgSelector id="send" />
                    </button>
                    <div className={s.title}>{t("main.send-btn")}</div>
                </div>
                <div
                    className={s.action}
                    onClick={() => navigate(`/receive?tokenPlatfrom=${token.platform}`)}
                >
                    <button className={s.icon_button}>
                        <SvgSelector id="receive" />
                    </button>
                    <div className={s.title}>{t("main.receive-btn")}</div>
                </div>
            </div>

            <div className={s.bg}>
                <SvgSelector id="header-bg" />
            </div>
        </div>
    );
};
