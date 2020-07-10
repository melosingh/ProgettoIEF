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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSign = exports.sendmlts = exports.createmlts = void 0;
const symbol_sdk_1 = require("symbol-sdk");
const readlineSync = __importStar(require("readline-sync"));
function createmlts() {
    /* start block 01 */
    // replace with network type
    const networkType = symbol_sdk_1.NetworkType.TEST_NET;
    // replace with candidate multisig private key
    const privateKey = readlineSync.question('\nPrivate key of the wallet that will became mlts [ex. TB..]: ');
    const account = symbol_sdk_1.Account.createFromPrivateKey(privateKey, networkType);
    // replace with cosignatory 1 public key
    const cosignatory1PublicKey = readlineSync.question('\nPublic key of the first consignatory wallet [ex. TB..]: ');
    const cosignatory1 = symbol_sdk_1.PublicAccount.createFromPublicKey(cosignatory1PublicKey, networkType);
    // replace with cosignatory 2 public key
    const cosignatory2PublicKey = readlineSync.question('\nPublic key of the second consignatory wallet [ex. TB..]: ');
    const cosignatory2 = symbol_sdk_1.PublicAccount.createFromPublicKey(cosignatory2PublicKey, networkType);
    /* end block 01 */
    /* start block 02 */
    const multisigAccountModificationTransaction = symbol_sdk_1.MultisigAccountModificationTransaction.create(symbol_sdk_1.Deadline.create(), 1, 1, [cosignatory1, cosignatory2], [], networkType);
    /* end block 02 */
    /* start block 03 */
    const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createBonded(symbol_sdk_1.Deadline.create(), [multisigAccountModificationTransaction.toAggregate(account.publicAccount)], networkType, [], symbol_sdk_1.UInt64.fromUint(2000000));
    /* end block 03 */
    /* start block 04 */
    // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
    const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
    const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
    console.log(signedTransaction.hash);
    /* end block 04 */
    /* start block 05 */
    // replace with symbol.xym id
    const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('519FC24B9223E0B4');
    // replace with network currency divisibility
    const networkCurrencyDivisibility = 6;
    const hashLockTransaction = symbol_sdk_1.HashLockTransaction.create(symbol_sdk_1.Deadline.create(), new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility))), symbol_sdk_1.UInt64.fromUint(480), signedTransaction, networkType, symbol_sdk_1.UInt64.fromUint(2000000));
    const signedHashLockTransaction = account.sign(hashLockTransaction, networkGenerationHash);
    // replace with node endpoint
    const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
    const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    const listener = repositoryFactory.createListener();
    const receiptHttp = repositoryFactory.createReceiptRepository();
    const transactionHttp = repositoryFactory.createTransactionRepository();
    const transactionService = new symbol_sdk_1.TransactionService(transactionHttp, receiptHttp);
    listener.open().then(() => {
        transactionService
            .announceHashLockAggregateBonded(signedHashLockTransaction, signedTransaction, listener)
            .subscribe((x) => console.log(x), (err) => console.log(err), () => listener.close());
    });
    /* end block 05  end create function*/
}
exports.createmlts = createmlts;
function sendmlts() {
    /* start block 01 */
    // replace network type
    const networkType = symbol_sdk_1.NetworkType.TEST_NET;
    // replace with cosignatory private key
    const cosignatoryPrivateKey = readlineSync.question('\nPrivate key of the consignatory wallet [ex. TB..]: ');
    ;
    const cosignatoryAccount = symbol_sdk_1.Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
    // replace with multisig account public key
    const multisigAccountPublicKey = readlineSync.question('\nPublic key of the consignatory wallet [ex. TB..]: ');
    ;
    const multisigAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(multisigAccountPublicKey, networkType);
    // replace with recipient address
    const recipientRawAddress = readlineSync.question('\nAddress of the recipient [ex. TB..]: ');
    ;
    const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(recipientRawAddress);
    // replace with symbol.xym id
    const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('5BFD2A641F8F214A');
    // replace with network currency divisibility
    const networkCurrencyDivisibility = 0;
    /* end block 01 */
    /* start block 02 */
    const rawnCoin = readlineSync.question('\nInsert the number of montinato to send: ');
    const nCoin = parseInt(rawnCoin);
    const message = readlineSync.question('\nInsert the text of the transaction: ');
    const transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(nCoin * Math.pow(10, networkCurrencyDivisibility)))], symbol_sdk_1.PlainMessage.create(message), networkType);
    /* end block 02 */
    /* start block 03 */
    const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createComplete(symbol_sdk_1.Deadline.create(), [transferTransaction.toAggregate(multisigAccount)], networkType, [], symbol_sdk_1.UInt64.fromUint(2000000));
    /* end block 03 */
    /* start block 04 */
    // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
    const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
    const signedTransaction = cosignatoryAccount.sign(aggregateTransaction, networkGenerationHash);
    // replace with node endpoint
    const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
    const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = repositoryFactory.createTransactionRepository();
    transactionHttp
        .announce(signedTransaction)
        .subscribe((x) => console.log(x), (err) => console.error(err));
    /* end block 04 */
}
exports.sendmlts = sendmlts;
function checkSign() {
    console.log("Account firma checkk");
    // replace with multisig address
    const rawAddress = readlineSync.question('\nInsert the address of multisign account:');
    const address = symbol_sdk_1.Address.createFromRawAddress(rawAddress);
    // replace with node endpoint
    const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
    const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    const multisigHttp = repositoryFactory.createMultisigRepository();
    multisigHttp
        .getMultisigAccountInfo(address)
        .subscribe((multisigInfo) => console.log(multisigInfo), (err) => console.error(err));
}
exports.checkSign = checkSign;
