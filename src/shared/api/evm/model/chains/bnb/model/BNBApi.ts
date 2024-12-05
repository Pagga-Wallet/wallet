import { CHAINS } from "@/shared/lib/types";
import { BasicOffchainAPI } from "../../../basicAPI";
import { bscInstance } from "../lib/providers/bscInstance";
import { bscProvider } from "../lib/providers/bscRPCProvider";

export class BNBAPIClient extends BasicOffchainAPI {
    constructor(address: string) {
        super(address, bscProvider, bscInstance, CHAINS.BNB);
    }
}
