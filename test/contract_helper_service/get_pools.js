'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {
    HttpEndpoint, Address, ContractHelperPoolMap, ContractHelperPool
} = require('../../lib')
const {ContractHelperService} = require('../../lib/contract_helper_service')

describe('ContractHelperService.getPools', () => {
    let service
    before(() => {
        service = ContractHelperService.create({
            endpoint: HttpEndpoint.fromString('https://bsc-dataseed2.binance.org/'),
            address: Address.fromHeximal('0xe7c43509fd53f9834eedd0635db826cbfbc8ad32')
        })
    })
    it('invalid addresses, throws error', async() => {
        let addresses = undefined
        await assert.rejects(
            async() => {
                await service.getPools(addresses)
            },
            {
                constructor: TypeError,
                message: 'addresses: expect type Array'
            }
        )
    })
    it('addresses has invalid item, throws error', async() => {
        let addresses = [
            Address.fromHeximal('0xa7e341cd4cf0647dbcf7e886653c876807136c23'),
            '0x38881bcab399b8c494cafffc881bcc5322d0ae06'
        ]
        await assert.rejects(
            async() => {
                await service.getPools(addresses)
            },
            {
                constructor: TypeError,
                message: 'addresses: [1]: expect type Address'
            }
        )
    })
    it('return a result', async() => {
        let addresses = [
            Address.fromHeximal('0x1b96b92314c44b159149f7e0303511fb2fc4774f'),
            Address.fromHeximal('0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458')
        ]
        let actualResult = await service.getPools(addresses)
        assert.strictEqual(actualResult instanceof ContractHelperPoolMap, true)
        let poolAddresses = Array.from(actualResult.keys())
        assert.deepStrictEqual(poolAddresses, [
            '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
            '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458'
        ])
        let pools = Array.from(actualResult.values())
        for (let pool of pools) {
            assert.strictEqual(pool instanceof ContractHelperPool, true)
        }
    })
})
