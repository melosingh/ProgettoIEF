var mnGen = require('mngen');
import * as hasha from 'hasha';
var colors = require('colors/safe');

function sha256(word: string): string {
  return hasha(word, { algorithm: 'sha256', encoding: 'hex' });
}

export function generateMnemonicPrivateKey(): string {
  const mnemonic: string[] = mnGen.list(4); // [provide,crimson,float,carrot]

  console.log(
    `Write down those mnemonic worlds that are used to generate your private key:`
  );
  console.log(colors.yellow(`\n${mnemonic}`));

  let hashes: string[] = [];
  mnemonic.map((world) => {
    hashes.push(sha256(world));
  });

  // Pseudo Merkle Tree
  let tmp_result_1 = sha256(hashes[0] + hashes[1]);
  let tmp_result_2 = sha256(hashes[2] + hashes[3]);

  let privateKey = sha256(tmp_result_1 + tmp_result_2);

  return privateKey;
}
