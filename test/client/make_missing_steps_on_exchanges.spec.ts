import assert from 'assert'
import { ethers } from 'ethers'
import { _makeMissingStepsOnExchanges } from '../../lib/client'
import { Exchange } from '../../lib/exchange'

describe('Client._makeMissingStepsOnExchanges', () => {
  it('valid input, return correct result', () => {
    let begin = ethers.utils.getAddress('0x16b24a1538e374099c0c99a612d7b35b3526ae78')
    let end = ethers.utils.getAddress('0xec90e559b61dee9dc54aaf5086a1085e77fe7185')
    let exchanges = [Exchange.PANCAKE, Exchange.PANCAKE2]
    let actualResult = _makeMissingStepsOnExchanges(begin, end, exchanges)
    let expectedResult = [
      {
        address: ethers.utils.getAddress('0x6e0a2065a267a0d3f8bbb58d38e5507f6743f8e5'),
        begin: ethers.utils.getAddress('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
        end: ethers.utils.getAddress('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0xdd84230fad8b42ca0f03054541d207ae29a35bf5'),
        begin: ethers.utils.getAddress('0x16b24a1538e374099c0c99a612d7b35b3526ae78'),
        end: ethers.utils.getAddress('0xec90e559b61dee9dc54aaf5086a1085e77fe7185'),
        creator: ethers.utils.getAddress('0xca143ce32fe78f1f7019d7d551a6402fc5350c73'),
      },
    ]
    assert.deepStrictEqual(actualResult, expectedResult)
  })
})
