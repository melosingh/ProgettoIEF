


import {
    Account,
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    Mosaic,
    MosaicId,
    MultisigAccountModificationTransaction,
    NetworkType,
    PublicAccount,
    RepositoryFactoryHttp,
    TransactionService,
    UInt64,
} from 'symbol-sdk';

import {Address} from 'symbol-sdk';
/* start block 01 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with candidate multisig private key
const privateKey = '54562040E9308E192D2C968D68163499BF9CBC49810B7458EC0632AE4CA34446';
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with cosignatory 1 public key la chiave publica di WeedCoins
const cosignatory1PublicKey = '4639A21356C8E1CC308B5FCDEB02D37C58415E23C74F1C49E80978C21D3A9DD5';
const cosignatory1 = PublicAccount.createFromPublicKey(cosignatory1PublicKey, networkType);
// replace with cosignatory 2 public key
const cosignatory2PublicKey = 'C7E92B717CEC1A3DF2FA303CE4B2366510752A0827316611530D1E62E7D225AF';
const cosignatory2 = PublicAccount.createFromPublicKey(cosignatory2PublicKey, networkType);
/* end block 01 */


export function creaAccountMultiFirma(){





/* start block 02 */
//CHIAMO QUESTA FUNZIONE PER CONVERTIRE L'ACCOUNT CONDIVISO IN UN ACCOUNT 
//MULTIFIRMA 
const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
    Deadline.create(),
    1,
    1,
    [cosignatory1,cosignatory2],
    [],
    networkType);
    

/* end block 02 */

/* start block 03 */
//CREO UNA TRANSAZIONE AGGREGATA(COLLEGATA) PASSANDOGLI QUELLA CREATA SOPRA
//. Questa azione è necessaria perché Alice e Bob devono 
//OPtare per diventare cosignori del nuovo account multisig.
const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [multisigAccountModificationTransaction.toAggregate(account.publicAccount)],
    networkType,
    [],
    UInt64.fromUint(2000000));
/* end block 03 */

/* start block 04 */
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4';
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 04 */

/* start block 05 */
// replace with symbol.xym id
const networkCurrencyMosaicId = new MosaicId('519FC24B9223E0B4');
// replace with network currency divisibility
const networkCurrencyDivisibility = 0;

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
const nodeUrl = 'http://api-02.ap-northeast-1.0941-v1.symboldev.network:3000/';
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
/* end block 05 */
}
export function check()
{
   

/* start block 01 */
// replace with multisig address
const rawAddress = 'TB6TSREWLDWBSX4ZCAF5VZJVT35MJDOMGYVJUMXT';
const address = Address.createFromRawAddress(rawAddress);

// replace with node endpoint
const nodeUrl = 'http://api-02.ap-northeast-1.0941-v1.symboldev.network:3000/';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const multisigHttp = repositoryFactory.createMultisigRepository();

multisigHttp
    .getMultisigAccountInfo(address)
    .subscribe((multisigInfo) => console.log(multisigInfo), (err) => console.error(err));
}