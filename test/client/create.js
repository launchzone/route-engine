'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Client} = require('../../lib')
const {SwapService} = require('../../lib/swap_service')
const {ContractHelperService} = require('../../lib/contract_helper_service')

describe('Client.create', () => {
    it('invalid swapEndpoint, throws error', () => {
        assert.throws(
            () => {
                Client.create({
                    swapEndpoint: 'fpt://foo.bar'
                })
            },
            {
                constructor: TypeError,
                message: 'swapEndpoint: expect type string as HTTP URL'
            }
        )
    })
    it('invalid bscEndpoint, throws error', () => {
        assert.throws(
            () => {
                Client.create({
                    bscEndpoint: 'fpt://foo.bar'
                })
            },
            {
                constructor: TypeError,
                message: 'bscEndpoint: expect type string as HTTP URL'
            }
        )
    })
    it('invalid contractHelper, throws error', () => {
        assert.throws(
            () => {
                Client.create({
                    contractHelper: '0xfff'
                })
            },
            {
                constructor: TypeError,
                message: 'contractHelper: expect type Heximal 20 bytes'
            }
        )
    })
    it('return client with default configuration', () => {
        let actualResult = Client.create()
        assert.strictEqual(actualResult instanceof Client, true)
        assert.strictEqual(actualResult._swapService instanceof SwapService, true)
        assert.strictEqual(actualResult._swapService._httpClient.getUri(), 'https://api.lz.finance/swap/')
        assert.strictEqual(actualResult._contractHelperService instanceof ContractHelperService, true)
        assert.strictEqual(
            actualResult._contractHelperService._contract.address,
            '0xe7c43509fd53f9834eedd0635db826cbfbc8ad32'
        )
        assert.strictEqual(
            actualResult._contractHelperService._contract.provider.connection.url,
            'https://bsc-dataseed2.binance.org/'
        )
    })
    it('return client with specified configuration', () => {
        let actualResult = Client.create({
            swapEndpoint: 'https://swap.foo',
            bscEndpoint: 'https://bsc.foo',
            contractHelper: '0xa414a7932be0a87194d2deb8e02890ece5501510'
        })
        assert.strictEqual(actualResult instanceof Client, true)
        assert.strictEqual(actualResult._swapService instanceof SwapService, true)
        assert.strictEqual(actualResult._swapService._httpClient.getUri(), 'https://swap.foo/')
        assert.strictEqual(actualResult._contractHelperService instanceof ContractHelperService, true)
        assert.strictEqual(
            actualResult._contractHelperService._contract.address,
            '0xa414a7932be0a87194d2deb8e02890ece5501510'
        )
        assert.strictEqual(
            actualResult._contractHelperService._contract.provider.connection.url,
            'https://bsc.foo/'
        )
    })
})
