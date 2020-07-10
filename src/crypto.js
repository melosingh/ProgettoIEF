"use strict";
exports.__esModule = true;
exports.generateMnemonicPrivateKey = void 0;
var mnGen = require('mngen');
var hasha = require("hasha");
var colors = require('colors/safe');
function sha256(word) {
    return hasha(word, { algorithm: 'sha256', encoding: 'hex' });
}
function generateMnemonicPrivateKey() {
    var mnemonic = mnGen.list(4); // [provide,crimson,float,carrot]
    console.log("Write down those mnemonic worlds that are used to generate your private key:");
    console.log(colors.yellow("\n" + mnemonic));
    var hashes = [];
    mnemonic.map(function (world) {
        hashes.push(sha256(world));
    });
    // Pseudo Merkle Tree
    var tmp_result_1 = sha256(hashes[0] + hashes[1]);
    var tmp_result_2 = sha256(hashes[2] + hashes[3]);
    var privateKey = sha256(tmp_result_1 + tmp_result_2);
    return privateKey;
}
exports.generateMnemonicPrivateKey = generateMnemonicPrivateKey;
