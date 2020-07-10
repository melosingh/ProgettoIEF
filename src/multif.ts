import {
    Account,
    Address,
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    Mosaic,
    MosaicId,
    MultisigAccountModificationTransaction,
    NetworkType,
    PublicAccount,
    PlainMessage,
    RepositoryFactoryHttp,
    TransactionService,
    TransferTransaction,
    UInt64,
} from 'symbol-sdk';
import * as  readlineSync from 'readline-sync';

export function checkSign(){
    console.log("Account firma checkk");
        // replace with multisig address
    const rawAddress = readlineSync.question(
        '\nInsert the address of multisign account:'
      );
    const address = Address.createFromRawAddress(rawAddress);
    
    // replace with node endpoint
    const nodeUrl = 'http://api-02.ap-northeast-1.0941-v1.symboldev.network:3000';
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const multisigHttp = repositoryFactory.createMultisigRepository();
    
    multisigHttp
        .getMultisigAccountInfo(address)
        .subscribe((multisigInfo) => console.log(multisigInfo), (err) => console.error(err));
    }
    

export function createmlts(){
/* start block 01 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with candidate multisig private key
const privateKey = readlineSync.question(
    '\nPrivate key of the wallet that will became mlts [ex. TB..]: '
);
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with cosignatory 1 public key
const cosignatory1PublicKey = readlineSync.question(
    '\nPublic key of the first consignatory wallet [ex. TB..]: '
);
const cosignatory1 = PublicAccount.createFromPublicKey(cosignatory1PublicKey, networkType);
// replace with cosignatory 2 public key
const cosignatory2PublicKey = readlineSync.question(
    '\nPublic key of the second consignatory wallet [ex. TB..]: '
);const cosignatory2 = PublicAccount.createFromPublicKey(cosignatory2PublicKey, networkType);
/* end block 01 */

/* start block 02 */
const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
    Deadline.create(),
    1,
    1,
    [cosignatory1, cosignatory2],
    [],
    networkType);
/* end block 02 */

/* start block 03 */
const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [multisigAccountModificationTransaction.toAggregate(account.publicAccount)],
    networkType,
    [],
    UInt64.fromUint(2000000));
/* end block 03 */

/* start block 04 */
// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 04 */

/* start block 05 */
// replace with symbol.xym id
const networkCurrencyMosaicId = new MosaicId('05D6A80DE3C9ADCA');
// replace with network currency divisibility
const networkCurrencyDivisibility = 6;

const hashLockTransaction = HashLockTransaction.create(
    Deadline.create(),
    new Mosaic(networkCurrencyMosaicId,
        UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility))),
    UInt64.fromUint(480),
    signedTransaction,
    networkType,
    UInt64.fromUint(2000000));

const signedHashLockTransaction = account.sign(hashLockTransaction, networkGenerationHash);

// replace with node endpoint
const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const listener = repositoryFactory.createListener();
const receiptHttp = repositoryFactory.createReceiptRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const transactionService = new TransactionService(transactionHttp, receiptHttp);

listener.open().then(() => {
    transactionService
        .announceHashLockAggregateBonded(signedHashLockTransaction, signedTransaction, listener)
        .subscribe(
            (x) => console.log(x),
            (err) => console.log(err),
            () => listener.close());
});
/* end block 05  end create function*/

 checkSign();
}

export function sendmlts(){
    /* start block 01 */
// replace network type
const transactionURL = 'http://explorer-951.symboldev.network/transaction/';

const networkType = NetworkType.TEST_NET;
// replace with cosignatory private key
const cosignatoryPrivateKey = readlineSync.question(
    '\nPrivate key of the consignatory wallet [ex. TB..]: '
);;
const cosignatoryAccount = Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
// replace with multisig account public key
const multisigAccountPublicKey = readlineSync.question(
    '\nPublic key of the consignatory wallet [ex. TB..]: '
);;
const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, networkType);
// replace with recipient address
const recipientRawAddress = readlineSync.question(
    '\nAddress of the recipient [ex. TB..]: '
);;
const recipientAddress = Address.createFromRawAddress(recipientRawAddress);
// replace with symbol.xym id
const networkCurrencyMosaicId = new MosaicId('05D6A80DE3C9ADCA');
// replace with network currency divisibility
const networkCurrencyDivisibility = 0;
/* end block 01 */

/* start block 02 */
const rawnCoin=readlineSync.question(
    '\nInsert the number of symbol to send: '
  );
  const nCoin = parseInt(rawnCoin);
  const message=readlineSync.question(
    '\nInsert the text of the transaction: '
  );
const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [new Mosaic (networkCurrencyMosaicId,
        UInt64.fromUint(nCoin * Math.pow(10, networkCurrencyDivisibility)))],
    PlainMessage.create(message),
    networkType);
/* end block 02 */

/* start block 03 */
const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [transferTransaction.toAggregate(multisigAccount)],
    networkType,
    [],
    UInt64.fromUint(2000000));
/* end block 03 */

/* start block 04 */
// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
const signedTransaction = cosignatoryAccount.sign(aggregateTransaction, networkGenerationHash);
// replace with node endpoint
const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';


const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 04 */

let checkURL = `\nTranscation link: ${transactionURL}${signedTransaction.hash} \n`;
console.log(checkURL);

}



