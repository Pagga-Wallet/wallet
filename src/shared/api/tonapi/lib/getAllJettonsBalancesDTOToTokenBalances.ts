import { Address } from "@ton/core";
import { formatUnits } from "ethers";
import { CHAINS, TokenBalance } from "../../../lib/types";
import { GetAllJettonsBalancesDTO } from "../types";

export const getAllJettonsBalancesDTOToTokenBalances = (
    dto: GetAllJettonsBalancesDTO
): TokenBalance[] => {
    return dto.balances.map((token) => ({
        tokenContract: Address.parse(token.jetton.address).toString({ bounceable: true }), // bounceable: true для API коингеко
        tokenID: token.jetton?.name,
        tokenSymbol: token.jetton?.symbol,
        tokenIcon: token.jetton?.image,
        tokenName: token.jetton?.name,
        balanceUSD:
            token.price.prices["USD"] *
            parseFloat(formatUnits(token.balance, token.jetton.decimals)),
        balance: parseFloat(formatUnits(token.balance, token.jetton.decimals)),
        change24h: parseFloat(token.price.diff_24h.USD.replace("−", "-").replace("%", "")),
        price: token.price.prices["USD"],
        platform: CHAINS.TON,
        isNativeToken: false,
        decimals: token.jetton.decimals,
    }));
};
