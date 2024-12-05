import { CHAINS } from "@/shared/lib/types";
import { BasicOffchainAPI } from "../../../basicAPI";
import { etherscanInstanse } from "../lib/providers/etherscanInstance";
import { ethereumProvider } from "../lib/providers/ethRPCProvider";

export class EthereumAPIClient extends BasicOffchainAPI {
    constructor(address: string) {
        super(address, ethereumProvider, etherscanInstanse, CHAINS.ETH);
    }
}
