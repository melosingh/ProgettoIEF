import {
  NetworkType,
  Account,
  SimpleWallet,
  Password,
  RepositoryFactoryHttp,
  Address,
  AccountInfo,
  TransactionService,
  TransactionHttp,
  TransferTransaction,
  Mosaic,
  MosaicId,
  UInt64,
  Deadline,
  PlainMessage,
  SignedTransaction,
  TransactionAnnounceResponse,
} from 'symbol-sdk';
import * as readlineSync from 'readline-sync';
var colors = require('colors/safe');

import { storeSecrets, Secrets, loadAccount } from './storage';
import { generateMnemonicPrivateKey } from './crypto';

export const NETWORKTYPE = NetworkType.TEST_NET;
export const MOSAIC_NAME = 'greencoins' ;                                  //'unicalcoins';
 
//47B276C30626442  http://explorer.symboldev.network/mosaic/481AD82F7CE0A8B3  http://explorer.symboldev.network/mosaic/747B276C30626442
// const OLD_MOSAIC_ID_UNICALCOIN = '6CAA8A74284FC608';  prof nuovo 7E7E69F892357A30
const MOSAIC_ID_UNICALCOIN = '05D6A80DE3C9ADCA';  //05D6A80DE3C9ADCA
const unicalcoin_divisibility = 0;

const HELP = ' mottabea@gmail.com && melosingh16@gmail.com';

// const old_nodeUrl = 'http://api-01.eu-central-1.symboldev.network:3000';
const nodeUrl =
  'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';

const transactionURL = 'http://explorer-951.symboldev.network/transaction/';

const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();

const old_generationHash =
  '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
const generationHash =
  '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';

const transactionRepository = repositoryFactory.createTransactionRepository();
const receiptHttp = repositoryFactory.createReceiptRepository();
const listener = repositoryFactory.createListener();
const transactionService = new TransactionService(
  transactionRepository,
  receiptHttp
);

export async function sendCoins(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    const account = await loadAccount();

    const rawRecipientAddress = readlineSync.question(
      '\nWallet address [ex. TB..]: '
    ); // TBMXSZXAEK7X6JC4XB7R5Y4JGPWNBALTBTYV4KAK

    const recipientAddress = Address.createFromRawAddress(rawRecipientAddress);

    const rawAmount = readlineSync.question(`\n${MOSAIC_NAME} to send: `);
    const amount = parseInt(rawAmount);
    const textToSend = readlineSync.question('\nText to send: ');

    const rawTx = createTransaction(
      recipientAddress.pretty(),
      amount,
      textToSend
    );
    const signedTx = signTransaction(account, rawTx);

    await doTransaction(signedTx);

    console.log(
      colors.green(
        `\n Transfered ${amount} ${MOSAIC_NAME} from ${account.address.pretty()} to address: ${recipientAddress.pretty()} 🙌 🚀`
      )
    );

    let checkURL = `\nTranscation link: ${transactionURL}${signedTx.hash}/status \n`;
    console.log(checkURL);

    try {
      resolve(true);
    } catch {
      reject(false);
    }
  });
}

// TX
function createTransaction(
  rawRecipientAddress: string,
  amount: number,
  text: string
): TransferTransaction {
  const recipientAddress = Address.createFromRawAddress(rawRecipientAddress);
  const currency = new MosaicId(MOSAIC_ID_UNICALCOIN);

  const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [
      new Mosaic(
        currency,
        UInt64.fromUint(amount * Math.pow(10, unicalcoin_divisibility))
      ),
    ],
    PlainMessage.create(text),
    NETWORKTYPE,
    UInt64.fromUint(2000000)
  );

  return transferTransaction;
}

// Sign
function signTransaction(
  account: Account,
  tx: TransferTransaction
): SignedTransaction {
  return account.sign(tx, generationHash);
}

// Announce the transaction to the network
async function doTransaction(
  signedTx: SignedTransaction
): Promise<TransactionAnnounceResponse> {
  return new Promise<TransactionAnnounceResponse>((resolve, reject) => {
    transactionRepository.announce(signedTx).subscribe(
      (tx) => {
        // console.log(`\nTransaction info: ${tx.message}\n`);
        resolve(tx);
      },
      (err: Error) => {
        reject(
          console.log(
            `\nIt was not possible to do the transfer. Error: ${err}\n`
          )
        );
      }
    );
  });
}

export async function getBalance(address: Address): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    accountHttp.getAccountInfo(address).subscribe((accountInfo) => {
      let mosaics = accountInfo.mosaics;
      let mosaic = mosaics.find(
        (mosaic) => mosaic.id.toHex() == MOSAIC_ID_UNICALCOIN
      );

      if (mosaic) {
        console.log(
          colors.yellow(
            `\nYou have ${mosaic.amount.toString()} ${MOSAIC_NAME} in your wallet`
          )
        );
      } else {
        console.log(
          colors.red(`\n You have 0 ${MOSAIC_NAME} in your balance.`)
        );
        console.log(
          colors.red(`\n You could ask to ${HELP} for some ${MOSAIC_NAME}`)
        );
      }
      resolve(true);
    }),
      (err: Error) => {
        reject(
          console.log(
            `An error was happening and it was not possible to check the balance: ${err}`
          )
        );
      };
  });
}

export function createAccount() {
  console.log(
    colors.yellow(`\nPlease enter an unique passord (8 character minumum).\n`)
  );

  let inputPassword = readlineSync.questionNewPassword(`\nInput a Password: `, {
    min: 8,
    max: 12,
  });
  const password = new Password(inputPassword);

  let walletName = readlineSync.question('\nGive to the wallet a name: ');

  const priv_key = generateMnemonicPrivateKey();

  const wallet = SimpleWallet.createFromPrivateKey(
    walletName,
    password,
    priv_key,
    NETWORKTYPE
  );

  const secret: Secrets = {
    password: password,
    privateKey: priv_key,
    walletName: walletName,
  };

  console.log(
    colors.blue(
      `A new wallet is generated with address: ${wallet.address.pretty()}`
    )
  ); // TCGCYI-IOBQQB-M7P7DW-SAA2FT-AQG67E-YRJZVN-EGZ7

  console.log(
    colors.yellow(`You can now start to send and receive ${MOSAIC_NAME}`)
  );

  storeSecrets(secret);
}
