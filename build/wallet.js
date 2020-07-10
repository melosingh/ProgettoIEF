"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.getBalance = exports.sendCoins = exports.MOSAIC_NAME = exports.NETWORKTYPE = void 0;
const symbol_sdk_1 = require("symbol-sdk");
const readlineSync = __importStar(require("readline-sync"));
var colors = require('colors/safe');
const storage_1 = require("./storage");
const crypto_1 = require("./crypto");
exports.NETWORKTYPE = symbol_sdk_1.NetworkType.TEST_NET;
exports.MOSAIC_NAME = 'unicalcoins';
//47B276C30626442  http://explorer.symboldev.network/mosaic/481AD82F7CE0A8B3  http://explorer.symboldev.network/mosaic/747B276C30626442
// const OLD_MOSAIC_ID_UNICALCOIN = '6CAA8A74284FC608';  prof nuovo 7E7E69F892357A30
const MOSAIC_ID_UNICALCOIN = '05D6A80DE3C9ADCA';
const unicalcoin_divisibility = 0;
const HELP = 'ezanardo@onezerobinary.com';
// const old_nodeUrl = 'http://api-01.eu-central-1.symboldev.network:3000';
const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
const transactionURL = 'http://explorer-951.symboldev.network/transaction/';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();
const old_generationHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
const generationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
const transactionRepository = repositoryFactory.createTransactionRepository();
const receiptHttp = repositoryFactory.createReceiptRepository();
const listener = repositoryFactory.createListener();
const transactionService = new symbol_sdk_1.TransactionService(transactionRepository, receiptHttp);
function sendCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const account = yield storage_1.loadAccount();
            const rawRecipientAddress = readlineSync.question('\nWallet address [ex. TB..]: '); // TBMXSZXAEK7X6JC4XB7R5Y4JGPWNBALTBTYV4KAK
            const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
            const rawAmount = readlineSync.question(`\n${exports.MOSAIC_NAME} to send: `);
            const amount = parseInt(rawAmount);
            const textToSend = readlineSync.question('\nText to send: ');
            const rawTx = createTransaction(recipientAddress.pretty(), amount, textToSend);
            const signedTx = signTransaction(account, rawTx);
            yield doTransaction(signedTx);
            console.log(colors.green(`\n Transfered ${amount} ${exports.MOSAIC_NAME} from ${account.address.pretty()} to address: ${recipientAddress.pretty()} 🙌 🚀`));
            let checkURL = `\nTranscation link: ${transactionURL}${signedTx.hash}/status \n`;
            console.log(checkURL);
            try {
                resolve(true);
            }
            catch (_a) {
                reject(false);
            }
        }));
    });
}
exports.sendCoins = sendCoins;
// TX
function createTransaction(rawRecipientAddress, amount, text) {
    const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
    const currency = new symbol_sdk_1.MosaicId(MOSAIC_ID_UNICALCOIN);
    const transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [
        new symbol_sdk_1.Mosaic(currency, symbol_sdk_1.UInt64.fromUint(amount * Math.pow(10, unicalcoin_divisibility))),
    ], symbol_sdk_1.PlainMessage.create(text), exports.NETWORKTYPE, symbol_sdk_1.UInt64.fromUint(2000000));
    return transferTransaction;
}
// Sign
function signTransaction(account, tx) {
    return account.sign(tx, generationHash);
}
// Announce the transaction to the network
function doTransaction(signedTx) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            transactionRepository.announce(signedTx).subscribe((tx) => {
                // console.log(`\nTransaction info: ${tx.message}\n`);
                resolve(tx);
            }, (err) => {
                reject(console.log(`\nIt was not possible to do the transfer. Error: ${err}\n`));
            });
        });
    });
}
function getBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            accountHttp.getAccountInfo(address).subscribe((accountInfo) => {
                let mosaics = accountInfo.mosaics;
                let mosaic = mosaics.find((mosaic) => mosaic.id.toHex() == MOSAIC_ID_UNICALCOIN);
                if (mosaic) {
                    console.log(colors.yellow(`\nYou have ${mosaic.amount.toString()} ${exports.MOSAIC_NAME} in your wallet`));
                }
                else {
                    console.log(colors.red(`\n You have 0 ${exports.MOSAIC_NAME} in your balance.`));
                    console.log(colors.red(`\n You could ask to ${HELP} for some ${exports.MOSAIC_NAME}`));
                }
                resolve(true);
            }),
                (err) => {
                    reject(console.log(`An error was happening and it was not possible to check the balance: ${err}`));
                };
        });
    });
}
exports.getBalance = getBalance;
function createAccount() {
    console.log(colors.yellow(`\nPlease enter an unique passord (8 character minumum).\n`));
    let inputPassword = readlineSync.questionNewPassword(`\nInput a Password: `, {
        min: 8,
        max: 12,
    });
    const password = new symbol_sdk_1.Password(inputPassword);
    let walletName = readlineSync.question('\nGive to the wallet a name: ');
    const priv_key = crypto_1.generateMnemonicPrivateKey();
    const wallet = symbol_sdk_1.SimpleWallet.createFromPrivateKey(walletName, password, priv_key, exports.NETWORKTYPE);
    const secret = {
        password: password,
        privateKey: priv_key,
        walletName: walletName,
    };
    console.log(colors.blue(`A new wallet is generated with address: ${wallet.address.pretty()}`)); // TCGCYI-IOBQQB-M7P7DW-SAA2FT-AQG67E-YRJZVN-EGZ7
    console.log(colors.yellow(`You can now start to send and receive ${exports.MOSAIC_NAME}`));
    storage_1.storeSecrets(secret);
}
exports.createAccount = createAccount;
