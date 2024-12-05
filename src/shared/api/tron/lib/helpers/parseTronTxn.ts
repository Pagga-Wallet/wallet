import { formatUnits } from "ethers";
import { TronWeb } from "tronweb";
import { TransferContract } from "tronweb/lib/esm/types/Contract";
import { SignedTransaction, Transaction } from "tronweb/lib/esm/types/Transaction";
import { CHAINS } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { NormalTransactionsResponse } from "../types/getNormalTransactionsDTO";
import { TokenTransactionsResponse } from "../types/getTokenTransactionsDTO";

export const parseTronNativeTxn = (
    txns: NormalTransactionsResponse,
    originAddress: string
): BaseTxnParsed[] =>
    txns
        .map<BaseTxnParsed>((tx) => {
            const amount = Number(TronWeb.fromSun(+tx.raw_data.contract[0].parameter.value.amount));
            const from = TronWeb.address.fromHex(
                tx.raw_data.contract[0].parameter.value.owner_address
            );
            const to = TronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.to_address);
            return {
                actionType: "transfer",
                hash: tx.txID,
                amount,
                chain: CHAINS.TRON,
                status: "applied", // Всегда подтверждённые, т.к. в апи проставлен флаг "только успешные транзы"
                symbol: "TRX",
                timestamp: new Date(tx.block_timestamp),
                from,
                to,
                direction: from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN",
            };
        })
        .filter((el) => !isNaN(el.amount) && el.amount);

export const parseTronSignedTxn = (
    txn: SignedTransaction,
    originAddress: string
): BaseTxnParsed => {
    const tx = txn as Transaction<TransferContract>;
    const amount = Number(TronWeb.fromSun(+tx.raw_data.contract[0].parameter.value.amount));
    const from = TronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.owner_address);
    const to = TronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.to_address);
    return {
        actionType: "transfer",
        hash: tx.txID,
        amount,
        chain: CHAINS.TRON,
        status: "applied", // Всегда подтверждённые, т.к. в апи проставлен флаг "только успешные транзы"
        symbol: "TRX",
        from,
        to,
        direction: from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN",
    };
};

export const parseTronTokenTxn = (
    txns: TokenTransactionsResponse,
    originAddress: string
): BaseTxnParsed[] =>
    txns.map((tx) => ({
        actionType: "transfer",
        hash: tx.transaction_id,
        amount: parseFloat(formatUnits(tx.value, +tx.token_info.decimals)),
        chain: CHAINS.TRON,
        status: "applied", // Всегда подтверждённые, т.к. в апи проставлен флаг "только успешные транзы"
        symbol: tx.token_info.symbol,
        timestamp: new Date(tx.block_timestamp),
        from: tx.from,
        to: tx.to,
        direction: tx.from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN",
    }));

// {
//     "data": {
//         "visible": false,
//         "txID": "9af0e3805223aab73e947414cb2ddd1221e9d4708fa39e8c4957ba19520fad94",
//         "raw_data_hex": "0a02884b2208b62601a071cb8eb140a8ae8ff784325a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a15415f2c42079ef9870cc37c19317ef5e37e51851bee121541e342a962f683ce59a31c016c3a89d92480db81211880ade20470c8d98bf78432",
//         "raw_data": {
//             "contract": [
//                 {
//                     "parameter": {
//                         "value": {
//                             "to_address": "41e342a962f683ce59a31c016c3a89d92480db8121",
//                             "owner_address": "415f2c42079ef9870cc37c19317ef5e37e51851bee",
//                             "amount": 10000000
//                         },
//                         "type_url": "type.googleapis.com/protocol.TransferContract"
//                     },
//                     "type": "TransferContract"
//                 }
//             ],
//             "ref_block_bytes": "884b",
//             "ref_block_hash": "b62601a071cb8eb1",
//             "expiration": 1719310473000,
//             "timestamp": 1719310413000
//         },
//         "signature": [
//             "ee93a92e2d83d9272340d388f0097d82d288ca24a1ce34d030be4d1f247118337ee10d5a91ac23b16b955a8408b3880d52ac153cecc919236f47d9b0c8192ac51C"
//         ]
//     },
//     "isError": false
// }
