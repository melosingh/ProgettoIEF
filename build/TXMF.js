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
exports.sendUnical = void 0;
const symbol_sdk_1 = require("symbol-sdk");
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const readlineSync = __importStar(require("readline-sync"));
/* start block 01 */
// replace with recipient address
function sendUnical() {
    const PATH_WALLET = `${os.homedir()}/${wallet_Name}.enry`;
    const privat_key = readlineSync.question('\nPrivate key of the wallet [ex. 84AE..]: ');
    const text = fs.readFileSync(PATH_WALLET, 'utf8');
    const secrects = JSON.parse(text);
    if (privat_key != secrects.privateKey) {
        console.log(`\nPassword provided is wrong`);
        sendMontinato();
    }
    const rawAddress = readlineSync.question('\nInsert the address recipient [ex. TB..]: ');
    ;
    const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawAddress);
    // replace with network type
    const networkType = symbol_sdk_1.NetworkType.TEST_NET;
    // replace with symbol.xym id
    const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('03E81693CAA6991E');
    // replace with network currency divisibility
    const networkCurrencyDivisibility = 0;
    const rawnCoin = readlineSync.question('\nInsert the number of montinato to send: ');
    const nCoin = parseInt(rawnCoin);
    const message = readlineSync.question('\nInsert the text of the transaction: ');
    const transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(nCoin * Math.pow(10, networkCurrencyDivisibility)))], symbol_sdk_1.PlainMessage.create(message), networkType, symbol_sdk_1.UInt64.fromUint(2000000));
    /* end block 01 */
    /* start block 02 */
    // replace with sender private key
    const account = symbol_sdk_1.Account.createFromPrivateKey(privat_key, symbol_sdk_1.NetworkType.TEST_NET);
    // replace with meta.generationHash (nodeUrl + '/block/1')
    const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
    const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
    /* end block 02 */
    /* start block 03 */
    // replace with node endpoint
    const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
    const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = repositoryFactory.createTransactionRepository();
    transactionHttp
        .announce(signedTransaction)
        .subscribe((x) => console.log(x), (err) => console.error(err));
}
exports.sendUnical = sendUnical;
