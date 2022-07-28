'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {HttpEndpoint} = require('../../lib')
const {SwapService} = require('../../lib/swap_service')

describe('SwapService.create', () => {
    it('options is not an object, throws error', () => {
        let options = undefined
        assert.throws(
            () => {
                SwapService.create(options)
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
                SwapService.create({
                    endpoint: 'fpt://foo.bar'
                })
            },
            {
                constructor: TypeError,
                message: 'endpoint: expect type HttpEndpoint'
            }
        )
    })
    it('return an instance', () => {
        let endpoint = 'https://foo.bar/'
        let actualResult = SwapService.create({
            endpoint: HttpEndpoint.fromString(endpoint)
        })
        assert.strictEqual(actualResult instanceof SwapService, true)
        assert.strictEqual(actualResult._httpClient.getUri(), endpoint)
    })
})
