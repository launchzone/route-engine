'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Address} = require('../../lib')

describe('Address.lt', () => {
    it('target is undefined, throws error', () => {
        let source = Address.fromHeximal('0x7eb5f116f26adda5375bed106958417089c7ceb6')
        let target = undefined
        assert.throws(
            () => source.lt(target),
            {
                constructor: TypeError,
                message: 'expect type Address'
            }
        )
    })
    it('less than target, return true', () => {
        let source = Address.fromHeximal('0x7eb5f116f26adda5375bed106958417089c7ceb6')
        let target = Address.fromHeximal('0xf502c8e24f00898f71b83ec1820691503236271e')
        let actualResult = source.lt(target)
        let expectedResult = true
        assert.strictEqual(actualResult, expectedResult)
    })
    it('greater than target, return false', () => {
        let source = Address.fromHeximal('0xf502c8e24f00898f71b83ec1820691503236271e')
        let target = Address.fromHeximal('0x7eb5f116f26adda5375bed106958417089c7ceb6')
        let actualResult = source.lt(target)
        let expectedResult = false
        assert.strictEqual(actualResult, expectedResult)
    })
    it('euqal target, return false', () => {
        let source = Address.fromHeximal('0xf502c8e24f00898f71b83ec1820691503236271e')
        let target = Address.fromHeximal('0xf502c8e24f00898f71b83ec1820691503236271e')
        let actualResult = source.lt(target)
        let expectedResult = false
        assert.strictEqual(actualResult, expectedResult)
    })
})
