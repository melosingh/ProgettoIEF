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
exports.generateMnemonicPrivateKey = void 0;
var mnGen = require('mngen');
const hasha = __importStar(require("hasha"));
var colors = require('colors/safe');
function sha256(word) {
    return hasha(word, { algorithm: 'sha256', encoding: 'hex' });
}
function generateMnemonicPrivateKey() {
    const mnemonic = mnGen.list(4); // [provide,crimson,float,carrot]
    console.log(`Write down those mnemonic worlds that are used to generate your private key:`);
    console.log(colors.yellow(`\n${mnemonic}`));
    let hashes = [];
    mnemonic.map((world) => {
        hashes.push(sha256(world));
    });
    // Pseudo Merkle Tree
    let tmp_result_1 = sha256(hashes[0] + hashes[1]);
    let tmp_result_2 = sha256(hashes[2] + hashes[3]);
    let privateKey = sha256(tmp_result_1 + tmp_result_2);
    return privateKey;
}
exports.generateMnemonicPrivateKey = generateMnemonicPrivateKey;
