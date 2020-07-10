import * as os from   'os';
import * as fs from 'fs';
import { readFileSync }  from 'fs';
import { Account, Password, SimpleWallet, NetworkType } from 'symbol-sdk';
import * as readlineSync from 'readline-sync';
var colors = require('colors/safe');

import { MOSAIC_NAME, NETWORKTYPE } from './wallet';

export type Secrets = {
  password: Password;
  privateKey: string;
  walletName: string;
};

export function storeSecrets(secrets: Secrets) {
  const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
  const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

  if (!fs.existsSync(PATH_HOME)) {
    fs.mkdirSync(PATH_HOME);
  }

  let fullPath = PATH_WALLET;
  if (fs.existsSync(fullPath)) {
    const stamp = new Date().toISOString();
    fullPath = `${PATH_HOME}/${stamp}-${MOSAIC_NAME}-secrets.enry`;
  }

  fs.writeFileSync(fullPath, JSON.stringify(secrets));

  console.log(colors.yellow(`\nSecrets stored!. ${fullPath}`));
}

export async function loadAccount(): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

    const text = fs.readFileSync(PATH_WALLET, 'utf8');
    const secrects: Secrets = JSON.parse(text);

    const password = readlineSync.question(`\nInput Password: `, {
      hideEchoBack: true,
    });

    if (password != secrects.password.value) {
      console.log(colors.red(`\nPassword provided is wrong`));
      loadAccount();
    }

    const account = Account.createFromPrivateKey(
      secrects.privateKey,
      NETWORKTYPE
    );

    try {
      resolve(account);
    } catch {
      reject(
        console.log(colors.red(`\nIt was not possible to retrive the account`))
      );
    }
  });
}

export async function loadWallet(): Promise<SimpleWallet> {
  return new Promise<SimpleWallet>((resolve, reject) => {
    const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

    const text = fs.readFileSync(PATH_WALLET, 'utf8');
    const secrects: Secrets = JSON.parse(text);

    const password = readlineSync.question(`\nInput Password: `, {
      hideEchoBack: true,
    });

    if (password != secrects.password.value) {
      console.log(colors.red(`\nPassword provided is wrong`));
      loadWallet();
    }
    console.log(colors.green(`\nRight Password was provided!`));

    const wallet = SimpleWallet.createFromPrivateKey(
      secrects.walletName,
      secrects.password,
      secrects.privateKey,
      NETWORKTYPE
    );

    console.log(
      colors.yellow(`\nWallet Public Key is: ${wallet.address.pretty()}`)
    );

    try {
      resolve(wallet);
    } catch {
      reject(`It was not possible to load the wallet.`);
    }
  });
}
