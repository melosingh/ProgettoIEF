"use strict";
exports.__esModule = true;
exports.sendmlts = exports.createmlts = exports.checkSign = void 0;
var symbol_sdk_1 = require("symbol-sdk");
var readlineSync = require("readline-sync");
function checkSign() {
    console.log("Account firma checkk");
    // replace with multisig address
    var rawAddress = readlineSync.question('\nInsert the address of multisign account:');
    var address = symbol_sdk_1.Address.createFromRawAddress(rawAddress);
    // replace with node endpoint
    var nodeUrl = 'http://api-02.ap-northeast-1.0941-v1.symboldev.network:3000';
    var repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    var multisigHttp = repositoryFactory.createMultisigRepository();
    multisigHttp
        .getMultisigAccountInfo(address)
        .subscribe(function (multisigInfo) { return console.log(multisigInfo); }, function (err) { return console.error(err); });
}
exports.checkSign = checkSign;
function createmlts() {
    /* start block 01 */
    // replace with network type
    var networkType = symbol_sdk_1.NetworkType.TEST_NET;
    // replace with candidate multisig private key
    var privateKey = readlineSync.question('\nPrivate key of the wallet that will became mlts [ex. TB..]: ');
    var account = symbol_sdk_1.Account.createFromPrivateKey(privateKey, networkType);
    // replace with cosignatory 1 public key
    var cosignatory1PublicKey = readlineSync.question('\nPublic key of the first consignatory wallet [ex. TB..]: ');
    var cosignatory1 = symbol_sdk_1.PublicAccount.createFromPublicKey(cosignatory1PublicKey, networkType);
    // replace with cosignatory 2 public key
    var cosignatory2PublicKey = readlineSync.question('\nPublic key of the second consignatory wallet [ex. TB..]: ');
    var cosignatory2 = symbol_sdk_1.PublicAccount.createFromPublicKey(cosignatory2PublicKey, networkType);
    /* end block 01 */
    /* start block 02 */
    var multisigAccountModificationTransaction = symbol_sdk_1.MultisigAccountModificationTransaction.create(symbol_sdk_1.Deadline.create(), 1, 1, [cosignatory1, cosignatory2], [], networkType);
    /* end block 02 */
    /* start block 03 */
    var aggregateTransaction = symbol_sdk_1.AggregateTransaction.createBonded(symbol_sdk_1.Deadline.create(), [multisigAccountModificationTransaction.toAggregate(account.publicAccount)], networkType, [], symbol_sdk_1.UInt64.fromUint(2000000));
    /* end block 03 */
    /* start block 04 */
    // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
    var networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
    var signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
    console.log(signedTransaction.hash);
    /* end block 04 */
    /* start block 05 */
    // replace with symbol.xym id
    var networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('05D6A80DE3C9ADCA');
    // replace with network currency divisibility
    var networkCurrencyDivisibility = 6;
    var hashLockTransaction = symbol_sdk_1.HashLockTransaction.create(symbol_sdk_1.Deadline.create(), new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility))), symbol_sdk_1.UInt64.fromUint(480), signedTransaction, networkType, symbol_sdk_1.UInt64.fromUint(2000000));
    var signedHashLockTransaction = account.sign(hashLockTransaction, networkGenerationHash);
    // replace with node endpoint
    var nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
    var repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    var listener = repositoryFactory.createListener();
    var receiptHttp = repositoryFactory.createReceiptRepository();
    var transactionHttp = repositoryFactory.createTransactionRepository();
    var transactionService = new symbol_sdk_1.TransactionService(transactionHttp, receiptHttp);
    listener.open().then(function () {
        transactionService
            .announceHashLockAggregateBonded(signedHashLockTransaction, signedTransaction, listener)
            .subscribe(function (x) { return console.log(x); }, function (err) { return console.log(err); }, function () { return listener.close(); });
    });
    /* end block 05  end create function*/
    checkSign();
}
exports.createmlts = createmlts;
function sendmlts() {
    /* start block 01 */
    // replace network type
    var transactionURL = 'http://explorer-951.symboldev.network/transaction/';
    var networkType = symbol_sdk_1.NetworkType.TEST_NET;
    // replace with cosignatory private key
    var cosignatoryPrivateKey = readlineSync.question('\nPrivate key of the consignatory wallet [ex. TB..]: ');
    ;
    var cosignatoryAccount = symbol_sdk_1.Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
    // replace with multisig account public key
    var multisigAccountPublicKey = readlineSync.question('\nPublic key of the consignatory wallet [ex. TB..]: ');
    ;
    var multisigAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(multisigAccountPublicKey, networkType);
    // replace with recipient address
    var recipientRawAddress = readlineSync.question('\nAddress of the recipient [ex. TB..]: ');
    ;
    var recipientAddress = symbol_sdk_1.Address.createFromRawAddress(recipientRawAddress);
    // replace with symbol.xym id
    var networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('05D6A80DE3C9ADCA');
    // replace with network currency divisibility
    var networkCurrencyDivisibility = 0;
    /* end block 01 */
    /* start block 02 */
    var rawnCoin = readlineSync.question('\nInsert the number of symbol to send: ');
    var nCoin = parseInt(rawnCoin);
    var message = readlineSync.question('\nInsert the text of the transaction: ');
    var transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(nCoin * Math.pow(10, networkCurrencyDivisibility)))], symbol_sdk_1.PlainMessage.create(message), networkType);
    /* end block 02 */
    /* start block 03 */
    var aggregateTransaction = symbol_sdk_1.AggregateTransaction.createComplete(symbol_sdk_1.Deadline.create(), [transferTransaction.toAggregate(multisigAccount)], networkType, [], symbol_sdk_1.UInt64.fromUint(2000000));
    /* end block 03 */
    /* start block 04 */
    // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
    var networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
    var signedTransaction = cosignatoryAccount.sign(aggregateTransaction, networkGenerationHash);
    // replace with node endpoint
    var nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
    var repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    var transactionHttp = repositoryFactory.createTransactionRepository();
    transactionHttp
        .announce(signedTransaction)
        .subscribe(function (x) { return console.log(x); }, function (err) { return console.error(err); });
    /* end block 04 */
    var checkURL = "\nTranscation link: " + transactionURL + signedTransaction.hash + " \n";
    console.log(checkURL);
}
exports.sendmlts = sendmlts;
