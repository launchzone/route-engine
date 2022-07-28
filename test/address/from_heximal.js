'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Address, Buffer} = require('../../lib')

describe('Address.fromHeximal', () => {
    it('input is undefined, throws error', () => {
        let input = undefined
        assert.throws(
            () => Address.fromHeximal(input),
            {
                constructor: TypeError,
                message: 'expect type Heximal 20 bytes'
            }
        )
    })
    it('input is not prefix by 0x, throws error', () => {
        let input = '0ff'
        assert.throws(
            () => Address.fromHeximal(input),
            {
                constructor: TypeError,
                message: 'expect type Heximal 20 bytes'
            }
        )
    })
    it('input contains invalid symbols, throws error', () => {
        let input = '0x0ffz'
        assert.throws(
            () => Address.fromHeximal(input),
            {
                constructor: TypeError,
                message: 'expect type Heximal 20 bytes'
            }
        )
    })
    it('too short heximal, throws error', () => {
        let input = '0xfda0'
        assert.throws(
            () => Address.fromHeximal(input),
            {
                constructor: TypeError,
                message: 'expect type Heximal 20 bytes'
            }
        )
    })
    it('too long heximal, throws error', () => {
        let input = '0xaf91e8198adeb127e033f36a09d11e24c1c2e4952e'
        assert.throws(
            () => Address.fromHeximal(input),
            {
                constructor: TypeError,
                message: 'expect type Heximal 20 bytes'
            }
        )
    })
    it('valid input, return an instance', () => {
        let input = '0xc64015aa589036bd4d180b492fa2e3168aaca1fb'
        let actualResult = Address.fromHeximal(input)
        let expectedResult = new Address(
            Buffer.from('c64015aa589036bd4d180b492fa2e3168aaca1fb', 'hex')
        )
        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
