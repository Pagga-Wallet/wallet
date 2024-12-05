import { CHAINS } from "@/shared/lib/types";
import { DEFAULT_PREFIX } from "../consts";

export const getTokensField = (chain: CHAINS) => DEFAULT_PREFIX + `SAVED-${chain}-TOKENS`;
