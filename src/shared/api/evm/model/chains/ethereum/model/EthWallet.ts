import { ethereumProvider } from "@/shared/api/evm";
import { CHAINS } from "@/shared/lib/types";
import { EVMBasicAPI } from "../../../basicAPI/model/EVMBasicAPI";

export class EthereumWallet extends EVMBasicAPI {
    constructor(address: string) {
        super(address, ethereumProvider, CHAINS.ETH);
    }
}
