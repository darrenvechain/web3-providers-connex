'use strict';

import 'mocha';
import { expect, assert } from 'chai';
import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex-driver';
import Web3 from 'web3';

import { ProviderWeb3, ErrMsg, types } from '../../src/index';
import { urls } from '../settings';
import { zeroBytes8, zeroBytes32, zeroBytes256 } from '../../src/common';

describe('Testing getBlock', () => {
	const net = new SimpleNet(urls.mainnet);
	const wallet = new SimpleWallet();
	// wallet.import(soloAccounts[0]);

	let driver: Driver;
	let web3: any;
	let connex: Connex;

	before(async () => {
		try {
			driver = await Driver.connect(net, wallet);
			connex = new Framework(driver);
			web3 = new Web3(new ProviderWeb3({ 
				connex: connex,
			}));
		} catch (err: any) {
			assert.fail('Initialization failed: ' + err);
		}
	})

	after(() => {
		driver?.close();
	})

	it('non-existing hash', async () => {
		const hash = '0x' + '0'.repeat(64);
		try {
			const blk = await web3.eth.getBlock(hash);
			expect(blk).to.be.null;
		} catch (err: any) {
			assert.fail(`UnexpectedBlock error: ${err}`);
		}
	})

	it('non-existing number', async () => {
		const num = 2 ** 32 - 1;
		try {
			const blk = await web3.eth.getBlock(num);
			expect(blk).to.be.null;
		} catch (err: any) {
			assert.fail(`UnexpectedBlock error: ${err}`);
		}
	})

	it('pending', async () => {
		const expectedBlockErr = ErrMsg.ArgumentMissingOrInvalid('eth_getBlockByNumber', 'blockNumber');
		try {
			await web3.eth.getBlock('pending');
			assert.fail();
		} catch (err: any) {
			expect(err.message).to.eql(expectedBlockErr);
		}
	})

	it('existing hash/id', async () => {
		const hash = '0x00af11f1090c43dcb9e23f3acd04fb9271ac08df0e1303711a851c03a960d571';
		const num = 11473393;
		const txs = ['0xf0d4f159a54650cecb19ae51acee042a73e038ff398a9af8288579aada4eee16'];

		let blk: types.RetBlock;
		try {
			blk = await web3.eth.getBlock(hash);
		} catch (err: any) {
			assert.fail(err.message || err);
		}

		expect(blk.hash).to.eql(hash);
		expect(blk.number).to.eql(num);
		expect(blk.transactions).to.eql(txs);

		// Unsupported fields
		expect(blk.difficulty).to.eql('0');
		expect(blk.totalDifficulty).to.eql('0');
		expect(blk.extraData).to.eql('0x');
		expect(blk.logsBloom).to.eql(zeroBytes256);
		expect(blk.sha3Uncles).to.eql(zeroBytes32);
		expect(blk.nonce).to.eql(zeroBytes8);
		expect(blk.uncles).to.eql([]);
	})

	it('existing number', async () => {
		const hash = '0x00af11f1090c43dcb9e23f3acd04fb9271ac08df0e1303711a851c03a960d571';
		const num = 11473393;

		let blk: types.RetBlock;
		try {
			blk = await web3.eth.getBlock(num);
		} catch (err: any) {
			assert.fail(`UnexpectedBlock error: ${err}`);
		}

		expect(blk.hash).to.eql(hash);
		expect(blk.number).to.eql(num);
	})

	it('latest', async () => {
		try {
			await web3.eth.getBlock('latest');
		} catch (err: any) {
			assert.fail(`UnexpectedBlock error: ${err}`);
		}
	})

	it('earliest', async () => {
		const genesisId = '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';
		let blk: types.RetBlock;
		try {
			blk = await web3.eth.getBlock('earliest');
		} catch (err: any) {
			assert.fail(`UnexpectedBlock error: ${err}`);
		}
		expect(blk.hash).to.eql(genesisId);
		expect(blk.number).to.eql(0);
	})
})