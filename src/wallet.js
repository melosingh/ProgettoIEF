"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createAccount = exports.getBalance = exports.sendCoins = exports.MOSAIC_NAME = exports.NETWORKTYPE = void 0;
var symbol_sdk_1 = require("symbol-sdk");
var readlineSync = require("readline-sync");
var colors = require('colors/safe');
var storage_1 = require("./storage");
var crypto_1 = require("./crypto");
exports.NETWORKTYPE = symbol_sdk_1.NetworkType.TEST_NET;
exports.MOSAIC_NAME = 'greencoins'; //'unicalcoins';
//47B276C30626442  http://explorer.symboldev.network/mosaic/481AD82F7CE0A8B3  http://explorer.symboldev.network/mosaic/747B276C30626442
// const OLD_MOSAIC_ID_UNICALCOIN = '6CAA8A74284FC608';  prof nuovo 7E7E69F892357A30
var MOSAIC_ID_UNICALCOIN = '05D6A80DE3C9ADCA'; //05D6A80DE3C9ADCA
var unicalcoin_divisibility = 0;
var HELP = ' mottabea@gmail.com && melosingh16@gmail.com';
// const old_nodeUrl = 'http://api-01.eu-central-1.symboldev.network:3000';
var nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
var transactionURL = 'http://explorer-951.symboldev.network/transaction/';
var repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
var accountHttp = repositoryFactory.createAccountRepository();
var old_generationHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
var generationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
var transactionRepository = repositoryFactory.createTransactionRepository();
var receiptHttp = repositoryFactory.createReceiptRepository();
var listener = repositoryFactory.createListener();
var transactionService = new symbol_sdk_1.TransactionService(transactionRepository, receiptHttp);
function sendCoins() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var account, rawRecipientAddress, recipientAddress, rawAmount, amount, textToSend, rawTx, signedTx, checkURL;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, storage_1.loadAccount()];
                            case 1:
                                account = _a.sent();
                                rawRecipientAddress = readlineSync.question('\nWallet address [ex. TB..]: ');
                                recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
                                rawAmount = readlineSync.question("\n" + exports.MOSAIC_NAME + " to send: ");
                                amount = parseInt(rawAmount);
                                textToSend = readlineSync.question('\nText to send: ');
                                rawTx = createTransaction(recipientAddress.pretty(), amount, textToSend);
                                signedTx = signTransaction(account, rawTx);
                                return [4 /*yield*/, doTransaction(signedTx)];
                            case 2:
                                _a.sent();
                                console.log(colors.green("\n Transfered " + amount + " " + exports.MOSAIC_NAME + " from " + account.address.pretty() + " to address: " + recipientAddress.pretty() + " \uD83D\uDE4C \uD83D\uDE80"));
                                checkURL = "\nTranscation link: " + transactionURL + signedTx.hash + "/status \n";
                                console.log(checkURL);
                                try {
                                    resolve(true);
                                }
                                catch (_b) {
                                    reject(false);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.sendCoins = sendCoins;
// TX
function createTransaction(rawRecipientAddress, amount, text) {
    var recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
    var currency = new symbol_sdk_1.MosaicId(MOSAIC_ID_UNICALCOIN);
    var transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    transactionRepository.announce(signedTx).subscribe(function (tx) {
                        // console.log(`\nTransaction info: ${tx.message}\n`);
                        resolve(tx);
                    }, function (err) {
                        reject(console.log("\nIt was not possible to do the transfer. Error: " + err + "\n"));
                    });
                })];
        });
    });
}
function getBalance(address) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    accountHttp.getAccountInfo(address).subscribe(function (accountInfo) {
                        var mosaics = accountInfo.mosaics;
                        var mosaic = mosaics.find(function (mosaic) { return mosaic.id.toHex() == MOSAIC_ID_UNICALCOIN; });
                        if (mosaic) {
                            console.log(colors.yellow("\nYou have " + mosaic.amount.toString() + " " + exports.MOSAIC_NAME + " in your wallet"));
                        }
                        else {
                            console.log(colors.red("\n You have 0 " + exports.MOSAIC_NAME + " in your balance."));
                            console.log(colors.red("\n You could ask to " + HELP + " for some " + exports.MOSAIC_NAME));
                        }
                        resolve(true);
                    }),
                        function (err) {
                            reject(console.log("An error was happening and it was not possible to check the balance: " + err));
                        };
                })];
        });
    });
}
exports.getBalance = getBalance;
function createAccount() {
    console.log(colors.yellow("\nPlease enter an unique passord (8 character minumum).\n"));
    var inputPassword = readlineSync.questionNewPassword("\nInput a Password: ", {
        min: 8,
        max: 12
    });
    var password = new symbol_sdk_1.Password(inputPassword);
    var walletName = readlineSync.question('\nGive to the wallet a name: ');
    var priv_key = crypto_1.generateMnemonicPrivateKey();
    var wallet = symbol_sdk_1.SimpleWallet.createFromPrivateKey(walletName, password, priv_key, exports.NETWORKTYPE);
    var secret = {
        password: password,
        privateKey: priv_key,
        walletName: walletName
    };
    console.log(colors.blue("A new wallet is generated with address: " + wallet.address.pretty())); // TCGCYI-IOBQQB-M7P7DW-SAA2FT-AQG67E-YRJZVN-EGZ7
    console.log(colors.yellow("You can now start to send and receive " + exports.MOSAIC_NAME));
    storage_1.storeSecrets(secret);
}
exports.createAccount = createAccount;
