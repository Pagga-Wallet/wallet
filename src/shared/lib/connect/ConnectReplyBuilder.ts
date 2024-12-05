import { Buffer } from "buffer";
import { sha256_sync } from "@ton/crypto";
import { Address } from "@ton/ton";
import {
    CHAIN,
    ConnectItem,
    ConnectItemReply,
    ConnectRequest,
    TonProofItemReply,
} from "@tonconnect/protocol";
import nacl from "tweetnacl";
import naclUtils from "tweetnacl-util";
import { DAppManifest } from "./models";

function getTimeSec() {
    return Math.floor(Date.now() / 1000);
}

const getDomainFromURL = (url: string): string => {
    const parsedURL = new URL(url);
    return parsedURL.hostname;
};

export class ConnectReplyBuilder {
    request: ConnectRequest;

    manifest: DAppManifest;

    constructor(request: ConnectRequest, manifest: DAppManifest) {
        this.request = request;
        this.manifest = manifest;
    }

    private static getNetwork() {
        return CHAIN.MAINNET;
    }

    public createTonProofItem(
        address: string,
        secretKey: Uint8Array,
        payload: string
    ): TonProofItemReply {
        try {
            const timestamp = getTimeSec();

            const timestampBuffer = Buffer.allocUnsafe(8);
            timestampBuffer.writeBigUInt64LE(BigInt(timestamp));

            const domain = getDomainFromURL(this.manifest.url);
            const domainBuffer = Buffer.from(domain, "utf8");
            const domainLengthBuffer = Buffer.allocUnsafe(4);
            domainLengthBuffer.writeUInt32LE(domainBuffer.byteLength);

            const [workchain, addrHash] = address.split(":");
            const addressWorkchainBuffer = Buffer.allocUnsafe(4);
            addressWorkchainBuffer.writeUInt32BE(Number(workchain));

            const addressBuffer = Buffer.concat([
                addressWorkchainBuffer,
                Buffer.from(addrHash, "hex"),
            ]);

            const messageBuffer = Buffer.concat([
                Buffer.from("ton-proof-item-v2/", "utf8"),
                addressBuffer,
                domainLengthBuffer,
                domainBuffer,
                timestampBuffer,
                Buffer.from(payload, "utf8"),
            ]);

            const bufferToSign = Buffer.concat([
                Buffer.from([0xff, 0xff]),
                Buffer.from("ton-connect", "utf8"),
                Buffer.from(sha256_sync(messageBuffer)),
            ]);

            const signed = nacl.sign.detached(Buffer.from(sha256_sync(bufferToSign)), secretKey);

            const signature = naclUtils.encodeBase64(signed);

            return {
                name: "ton_proof",
                proof: {
                    timestamp,
                    domain: {
                        lengthBytes: domainBuffer.byteLength,
                        value: domain,
                    },
                    signature,
                    payload,
                },
            };
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Wallet internal error";
            return {
                name: "ton_proof",
                error: {
                    code: 0,
                    message: errorMessage,
                },
            };
        }
    }

    createReplyItems(
        address: string,
        privateKey: Uint8Array,
        publicKey: string, // hex
        walletStateInit: string
    ): ConnectItemReply[] {
        const formattedAddress = Address.parse(address).toRawString();
        const replyItems = this.request.items.map((requestItem): ConnectItemReply => {
            switch (requestItem.name) {
                case "ton_addr":
                    return {
                        name: "ton_addr",
                        address: formattedAddress,
                        network: ConnectReplyBuilder.getNetwork(),
                        publicKey,
                        walletStateInit,
                    };

                case "ton_proof":
                    // eslint-disable-next-line no-case-declarations
                    const proof = this.createTonProofItem(
                        formattedAddress,
                        privateKey,
                        requestItem.payload
                    );

                    return proof as unknown as ConnectItemReply;

                default:
                    return {
                        name: (requestItem as ConnectItem).name,
                        error: { code: 400 },
                    } as unknown as ConnectItemReply;
            }
        });

        return replyItems;
    }

    static createAutoConnectReplyItems(
        address: string,
        publicKey: Uint8Array,
        walletStateInit: string
    ): ConnectItemReply[] {
        return [
            {
                name: "ton_addr",
                address,
                network: ConnectReplyBuilder.getNetwork(),
                publicKey: Buffer.from(publicKey).toString("hex"),
                walletStateInit,
            },
        ];
    }
}
