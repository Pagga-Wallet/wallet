import { bscProvider } from "@/shared/api/evm";
import { CHAINS } from "@/shared/lib/types";
import { EVMBasicAPI } from "../../../basicAPI/model/EVMBasicAPI";

export class BNBWallet extends EVMBasicAPI {
    constructor(address: string) {
        super(address, bscProvider, CHAINS.BNB);
    }
}
