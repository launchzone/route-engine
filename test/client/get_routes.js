'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Client} = require('../../lib/client')

describe('Client.getRoutes', () => {
    let service
    before(() => {
        service = Client.create()
    })
    it('invalid source, throws error', async() => {
        let source = '0xffc'
        let target = '0x92c34b2c1f73a1f40d1f785f4a7a18d3d476763d'
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target)
            },
            {
                constructor: TypeError,
                message: 'source: expect type Heximal 20 bytes'
            }
        )
    })
    it('invalid target, throws error', async() => {
        let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        let target = '0xffc'
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target)
            },
            {
                constructor: TypeError,
                message: 'target: expect type Heximal 20 bytes'
            }
        )
    })
    it('invalid options.limit, throws error', async() => {
        let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
        let options = {
            limit: '128'
        }
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target, options)
            },
            {
                constructor: TypeError,
                message: 'options: limit: expect type number, integer in range'
            }
        )
    })
    it('invalid options.sourceTokenQuantity, throws error', async() => {
        let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
        let options = {
            sourceTokenQuantity: 17
        }
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target, options)
            },
            {
                constructor: TypeError,
                message: 'options: sourceTokenQuantity: expect type number, integer in range'
            }
        )
    })
    it('invalid options.targetTokenQuantity, throws error', async() => {
        let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
        let options = {
            targetTokenQuantity: 17
        }
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target, options)
            },
            {
                constructor: TypeError,
                message: 'options: targetTokenQuantity: expect type number, integer in range'
            }
        )
    })
    it('invalid options.weight, throws error', async() => {
        let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
        let options = {
            weight: 1.1
        }
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target, options)
            },
            {
                constructor: TypeError,
                message: 'options: weight: expect type number in range'
            }
        )
    })
    it('source is equal target, throws error', async() => {
        let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        let target = '0x769C79a72f06fc5a2173cf3e7a667bc95e28ac2c'
        await assert.rejects(
            async() => {
                await service.getRoutes(source, target)
            },
            {
                constructor: Error,
                message: 'source and target: expect difference'
            }
        )
    })
    it('invoke without options, return a result', async() => {
        let source = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        let target = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        let routes = await service.getRoutes(source, target, {
            limit: 10000,
            sourceTokenQuantity: 2,
            targetTokenQuantity: 2
        })
        assert.strictEqual(routes instanceof Array, true)
    })
})
