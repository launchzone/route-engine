'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {
    Address, GetPoolsByTopTokenReserveResult, Pool,
    BigNumber
} = require('../../lib')
const {_getIntermediateTokens} = require('../../lib/client')

describe('Client._getIntermediateTokens', () => {
    it('input is valid, return correct result', () => {
        let poolMap = GetPoolsByTopTokenReserveResult.fromEntries([
            [
                '0xc4fc2e107f34edd6d23e934f0b33248444798efd',
                [
                    Pool.create({
                        address: Address.fromHeximal('0x4e3d25aa0d688216e74107bae5c4d5abb506b011'),
                        address0: Address.fromHeximal('0x8a7d5ca4e949cfc56234e1513a9c7fb820c515e5'),
                        address1: Address.fromHeximal('0xc4fc2e107f34edd6d23e934f0b33248444798efd'),
                        creator: Address.fromHeximal('0xc273494e2f71bd4857eef2e6b2e4b9a21e409af6'),
                        reserve0: BigNumber.fromHeximal('0x66c28221'),
                        reserve1: BigNumber.fromHeximal('0x086e')
                    }),
                    Pool.create({
                        address: Address.fromHeximal('0x00fd6e96588708501f15bbc501c8b9db9380ab4b'),
                        address0: Address.fromHeximal('0xc4fc2e107f34edd6d23e934f0b33248444798efd'),
                        address1: Address.fromHeximal('0xc7cbc71d01697b5c51748e2d19f05b6ebfbcf656'),
                        creator: Address.fromHeximal('0x891a3d437c8a76b979f7a6fb264334ddb2e6b355'),
                        reserve0: BigNumber.fromHeximal('0x1b7a00'),
                        reserve1: BigNumber.fromHeximal('0xa2d9fcf7')
                    })
                ]
            ],
            [
                '0x616b8effe34f1e007da5629a2755bfc07014e254',
                [
                    Pool.create({
                        address: Address.fromHeximal('0xc3d2c9c33159b4cbc984c5b6abd8c2f612a3f07e'),
                        address0: Address.fromHeximal('0x616b8effe34f1e007da5629a2755bfc07014e254'),
                        address1: Address.fromHeximal('0xb9354dd43e4df37cda6bd336494bcd1104b64223'),
                        creator: Address.fromHeximal('0xf7fc561ede7d1cafb2643d41fc597ab77699deee'),
                        reserve0: BigNumber.fromHeximal('0x0958bc89'),
                        reserve1: BigNumber.fromHeximal('0xd5cec2')
                    }),
                    Pool.create({
                        address: Address.fromHeximal('0xd5d166a56c7a770e380703e214ed9335c0003980'),
                        address0: Address.fromHeximal('0x48ceb31694aebe366d8f2ce9b1e9044619d25e3d'),
                        address1: Address.fromHeximal('0x616b8effe34f1e007da5629a2755bfc07014e254'),
                        creator: Address.fromHeximal('0xf8cdec411983188204c11e320d4ad63e4f2d4067'),
                        reserve0: BigNumber.fromHeximal('0x5a7'),
                        reserve1: BigNumber.fromHeximal('0xcc53447d')
                    })
                ]
            ]
        ])
        let source = Address.fromHeximal('0xc4fc2e107f34edd6d23e934f0b33248444798efd')
        let target = Address.fromHeximal('0x616b8effe34f1e007da5629a2755bfc07014e254')
        let actualResult = _getIntermediateTokens(poolMap, source, target)
        let expectedResult = {
            x: [
                Address.fromHeximal('0xc7cbc71d01697b5c51748e2d19f05b6ebfbcf656'),
                Address.fromHeximal('0x8a7d5ca4e949cfc56234e1513a9c7fb820c515e5')
            ],
            y: [
                Address.fromHeximal('0x48ceb31694aebe366d8f2ce9b1e9044619d25e3d'),
                Address.fromHeximal('0xb9354dd43e4df37cda6bd336494bcd1104b64223')
            ]
        }
        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
