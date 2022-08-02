import assert from 'assert'
import { createClient, EvaluatedRoute, RouteOption } from '../../lib/client'

describe('Client.getRoutes', () => {
  let service
  before(() => {
    service = createClient({})
  })
  it('invalid options.sourceTokenQuantity, throws error', async () => {
    let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
    let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
    await assert.rejects(
      async () => {
        await service.getRoutes(source, target, {
          sourceTokenQuantity: 17,
        })
      },
      {
        constructor: Error,
      },
    )
  })
  it('invalid options.targetTokenQuantity, throws error', async () => {
    let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
    let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
    let options = {
      targetTokenQuantity: 17,
    }
    await assert.rejects(
      async () => {
        await service.getRoutes(source, target, options)
      },
      {
        constructor: Error,
      },
    )
  })
  it('invalid options.weight, throws error', async () => {
    let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
    let target = '0xb144927dddaf1ee3be8dd21a3e2710f199b2fe7d'
    let options = {
      weight: 1.1,
    }
    await assert.rejects(
      async () => {
        await service.getRoutes(source, target, options)
      },
      {
        constructor: Error,
      },
    )
  })
  it('source is equal target, throws error', async () => {
    let source = '0x769c79a72f06fc5a2173cf3e7a667bc95e28ac2c'
    let target = '0x769C79a72f06fc5a2173cf3e7a667bc95e28ac2c'
    await assert.rejects(
      async () => {
        await service.getRoutes(source, target)
      },
      {
        constructor: Error,
      },
    )
  })
  it('invoke without options, return a result', async () => {
    let source = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
    let target = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    let routes = await service.getRoutes(source, target, {
      limit: 5,
      sourceTokenQuantity: 2,
      targetTokenQuantity: 2,
    })
    assert.strictEqual(routes instanceof Array, true)
    assert.strictEqual(routes.length, 5)
  })
})
