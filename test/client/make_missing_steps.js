'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Address, Exchange} = require('../../lib')
const {_makeMissingSteps} = require('../../lib/client')

describe('Client._makeMissingSteps', () => {
    it('valid input, return correct result', () => {
        let a = Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78')
        let b = Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185')
        let x = [
            Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
            Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363')
        ]
        let y = [
            Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9')
        ]
        let exchanges = [Exchange.PANCAKE, Exchange.PANCAKE2]
        let actualResult = _makeMissingSteps(a, b, x, y, exchanges)
        let expectedResult = {
            sAb: [
                {
                    address: Address.fromHeximal('0x6e0a2065a267a0d3f8bbb58d38e5507f6743f8e5'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0xdd84230fad8b42ca0f03054541d207ae29a35bf5'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                }
            ],
            sAx: [
                {
                    address: Address.fromHeximal('0x733ee2dbba0913e9fe55d98f88d31a0a98505d38'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0x19979d298a2720f597189fda8c6e89dbe6fe0cfa'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                },
                {
                    address: Address.fromHeximal('0x827668e731949147515abc9cb458d58c8a1ecbfd'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0x1b4ea72f12f70ca7b09b40870f11d646b4c2b8d7'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                }
            ],
            sAy: [
                {
                    address: Address.fromHeximal('0x991110f7f5ca12dfca5f4491d7a60878b163ec52'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0xb4271bd485f75763ef5d954975ffecddd3cb1243'),
                    begin: Address.fromHeximal('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
                    end: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                }
            ],
            sXb: [
                {
                    address: Address.fromHeximal('0x4c48d079bc12f88dd0c2b04ca73be7cc36633916'),
                    begin: Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0xf9c300a57c213d49fd730ffc3d69609078d4f412'),
                    begin: Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                },
                {
                    address: Address.fromHeximal('0xd4e13232ccc136ad389b111063fb5b6134c7e02a'),
                    begin: Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0x6d95fe1f8a2ace397739a7990c318442943e0b1f'),
                    begin: Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                }
            ],
            sYb: [
                {
                    address: Address.fromHeximal('0x7cf24d9d42490ab9ee2f9888bde83ae084104d78'),
                    begin: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0xf32da2725fc4125b324e3b1674f8c9b20b5c4a85'),
                    begin: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    end: Address.fromHeximal('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                }
            ],
            sXy: [
                {
                    address: Address.fromHeximal('0x4e9d15e99a57d115efe9a520e3c4d5f731eb035f'),
                    begin: Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
                    end: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0xc5593aff402574bf5d91ff7ac497f09aced87b01'),
                    begin: Address.fromHeximal('0x6ba61fa68bedde4c162b92fe87d7ae67054afc05'),
                    end: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                },
                {
                    address: Address.fromHeximal('0x510ea0f257dfb6a6672817088c4bdcc019d400f7'),
                    begin: Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363'),
                    end: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    creator: Address.fromHeximal('0xbcfccbde45ce874adcb698cc183debcf17952812')
                },
                {
                    address: Address.fromHeximal('0x0f05c8fa818e60a7a63728df9a0c18002717cff2'),
                    begin: Address.fromHeximal('0x8b197e1082709261ac3e523fdab2c44c73651363'),
                    end: Address.fromHeximal('0x6016379e33140280c9f1fa9c47fcfeaa3b94a5e9'),
                    creator: Address.fromHeximal('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
                }
            ]
        }
        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
