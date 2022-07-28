'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const AxiosMockAdapter = require('axios-mock-adapter')
const {
    HttpEndpoint, Address, BigNumber, GetPoolsByTopTokenReserveResult,
    Pool, HttpEndpointError
} = require('../../lib')
const {SwapService} = require('../../lib/swap_service')

describe('SwapService.getPoolsByTopTokenReserve', () => {
    let service
    let httpClientMock
    before(() => {
        service = SwapService.create({
            endpoint: HttpEndpoint.fromString('https://foo.bar/')
        })
        httpClientMock = new AxiosMockAdapter(service._httpClient)
    })
    beforeEach(() => {
        httpClientMock.reset()
    })
    it('invalid addresses, throws error', async() => {
        let addresses = undefined
        await assert.rejects(
            async() => {
                await service.getPoolsByTopTokenReserve(addresses)
            },
            {
                constructor: TypeError,
                message: 'addresses: expect type Array'
            }
        )
    })
    it('addresses has invalid item, throws error', async() => {
        let addresses = [
            Address.fromHeximal('0x46345e714f7d1a1235f39a4f8c69563c89732551'),
            '0x506c51489ef2d77d5292aa79dc43e7e8ee71369d'
        ]
        await assert.rejects(
            async() => {
                await service.getPoolsByTopTokenReserve(addresses)
            },
            {
                constructor: TypeError,
                message: 'addresses: [1]: expect type Address'
            }
        )
    })
    it('invalid limit, throws error', async() => {
        let addresses = [
            Address.fromHeximal('0x46345e714f7d1a1235f39a4f8c69563c89732551')
        ]
        let limit = '8'
        await assert.rejects(
            async() => {
                await service.getPoolsByTopTokenReserve(addresses, limit)
            },
            {
                constructor: TypeError,
                message: 'limit: expect type number'
            }
        )
    })
    it('API responds non object, throws error', async() => {
        let addresses = [
            Address.fromHeximal('0xe541d262b522a22757a49f1230043992f675a14a')
        ]
        httpClientMock.onGet('/pool/top-token-reserve').reply(() => {
            return [200, undefined]
        })
        await assert.rejects(
            async() => {
                await service.getPoolsByTopTokenReserve(addresses)
            },
            {
                constructor: HttpEndpointError,
                message: 'status=200; body=expect type string as JSON'
            }
        )
    })
    it('API responds invalid pool address, throws error', async() => {
        let addresses = [
            Address.fromHeximal('0xe541d262b522a22757a49f1230043992f675a14a')
        ]
        httpClientMock.onGet('/pool/top-token-reserve').reply(() => {
            let data = {
                '0xe541d262b522a22757a49f1230043992f675a14a': [
                    {
                        address: '0xff',
                        address0: '0x3cc6bff06d0778c8bb01ca11cdef9fde7a06fae0',
                        address1: '0x5c485689700b5b7c08f3bab8cfae0b907e0669dc',
                        creator: '0x1b3a9fa9f708bccaa205e0d413c56ad68ca5bac3',
                        reserve0: '0x2456660a8a',
                        reserve1: '0x7133d0e85e0a7b'
                    }
                ]
            }
            return [200, JSON.stringify(data)]
        })
        await assert.rejects(
            async() => {
                await service.getPoolsByTopTokenReserve(addresses)
            },
            {
                constructor: HttpEndpointError,
                message: 'status=200; body=0xe541d262b522a22757a49f1230043992f675a14a: [0]: address: expect type Heximal 20 bytes'
            }
        )
    })
    it('API responds correct data structure, return a result', async() => {
        httpClientMock.onGet('/pool/top-token-reserve').reply(() => {
            let data = {
                '0xe541d262b522a22757a49f1230043992f675a14a': [
                    {
                        address: '0x56f5e703be1e0e2f263d03f29ac6adfc00415373',
                        address0: '0x3cc6bff06d0778c8bb01ca11cdef9fde7a06fae0',
                        address1: '0x5c485689700b5b7c08f3bab8cfae0b907e0669dc',
                        creator: '0x1b3a9fa9f708bccaa205e0d413c56ad68ca5bac3',
                        reserve0: '0x2456660a8a',
                        reserve1: '0x7133d0e85e0a7b'
                    }
                ],
                '0x9e662e0bd5a10d745aaa651c3ec604b77ba630ca': [
                    {
                        address: '0xe62b4657f3cbf123788a91fb25fe32fa616c3f4b',
                        address0: '0x1eb87d412b19ecbb07d9801d81303e8e42e72330',
                        address1: '0x9142da3bd45e68b7be9becf722326def536e15cb',
                        creator: '0xb15821822e3dd260e939d009c86d80f9e1c97469',
                        reserve0: '0x74fe5c8f',
                        reserve1: '0x516c8d'
                    }
                ]
            }
            return [200, JSON.stringify(data)]
        })
        let addresses = [
            Address.fromHeximal('0xe541d262b522a22757a49f1230043992f675a14a'),
            Address.fromHeximal('0x9e662e0bd5a10d745aaa651c3ec604b77ba630ca')
        ]
        let actualResult = await service.getPoolsByTopTokenReserve(addresses)
        let expectedResult = new GetPoolsByTopTokenReserveResult([
            [
                '0xe541d262b522a22757a49f1230043992f675a14a',
                [
                    Pool.create({
                        address: Address.fromHeximal('0x56f5e703be1e0e2f263d03f29ac6adfc00415373'),
                        address0: Address.fromHeximal('0x3cc6bff06d0778c8bb01ca11cdef9fde7a06fae0'),
                        address1: Address.fromHeximal('0x5c485689700b5b7c08f3bab8cfae0b907e0669dc'),
                        creator: Address.fromHeximal('0x1b3a9fa9f708bccaa205e0d413c56ad68ca5bac3'),
                        reserve0: BigNumber.fromHeximal('0x2456660a8a'),
                        reserve1: BigNumber.fromHeximal('0x7133d0e85e0a7b')
                    })
                ]
            ],
            [
                '0x9e662e0bd5a10d745aaa651c3ec604b77ba630ca',
                [
                    Pool.create({
                        address: Address.fromHeximal('0xe62b4657f3cbf123788a91fb25fe32fa616c3f4b'),
                        address0: Address.fromHeximal('0x1eb87d412b19ecbb07d9801d81303e8e42e72330'),
                        address1: Address.fromHeximal('0x9142da3bd45e68b7be9becf722326def536e15cb'),
                        creator: Address.fromHeximal('0xb15821822e3dd260e939d009c86d80f9e1c97469'),
                        reserve0: BigNumber.fromHeximal('0x74fe5c8f'),
                        reserve1: BigNumber.fromHeximal('0x516c8d')
                    })
                ]
            ]
        ])
        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
