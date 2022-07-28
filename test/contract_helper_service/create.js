'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {HttpEndpoint, Address} = require('../../lib')
const {ContractHelperService} = require('../../lib/contract_helper_service')

describe('ContractHelperService.create', () => {
    it('options is not an object, throws error', () => {
        let options = undefined
        assert.throws(
            () => {
                ContractHelperService.create(options)
            },
            {
                constructor: TypeError,
                message: 'expect type object'
            }
        )
    })
    it('invalid endpoint, throws error', () => {
        assert.throws(
            () => {
                ContractHelperService.create({
                    endpoint: 'fpt://foo.bar',
                    address: '0xf6cb524a6e1d6527ed261a3219e0ff4378c49dc0'
                })
            },
            {
                constructor: TypeError,
                message: 'endpoint: expect type HttpEndpoint'
            }
        )
    })
    it('invalid address, throws error', () => {
        assert.throws(
            () => {
                ContractHelperService.create({
                    endpoint: HttpEndpoint.fromString('http://foo.bar'),
                    address: '0xb00aadb9434636e6c5573be682b6541553256e4e'
                })
            },
            {
                constructor: TypeError,
                message: 'address: expect type Address'
            }
        )
    })
    it('return an instance', () => {
        let endpoint = HttpEndpoint.fromString('https://foo.bar/')
        let address = Address.fromHeximal('0xb00aadb9434636e6c5573be682b6541553256e4e')
        let actualResult = ContractHelperService.create({endpoint, address})
        assert.strictEqual(actualResult instanceof ContractHelperService, true)
        assert.strictEqual(actualResult._contract.provider.connection.url, endpoint.value.toString())
    })
})
