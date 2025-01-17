'use strict';

import { HDNode } from 'thor-devkit';
import fs from 'fs';
import path from 'path';

const words = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const hdNode = HDNode.fromMnemonic(words.split(' '));

let soloAccounts: string[] = [];
for (let i = 0; i < 10; i++) {
	const priv = hdNode.derive(i).privateKey;
	soloAccounts.push('0x' + priv?.toString('hex'));
}
export { soloAccounts }

export const urls = {
	testnet: 'http://testnet.veblocks.net/',
	mainnet: 'http://mainnet.veblocks.net/',
	solo: 'http://127.0.0.1:8669/'
}

const solcJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd() + '/test/contracts/test.json')).toString());
export const bin: string = solcJson.contracts['test.sol:Test'].bin;
export const abi: any[] = solcJson.contracts['test.sol:Test'].abi;