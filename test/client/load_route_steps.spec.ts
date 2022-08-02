import assert from 'assert'
import { ethers } from 'ethers'
import { createClient } from '../../lib/client'
describe('Client._loadRouteSteps', () => {
  let service
  before(() => {
    service = createClient({})
  })
  it('valid input, return correct result', async () => {
    let sAb = [
      {
        address: ethers.utils.getAddress('0x1b96b92314c44b159149f7e0303511fb2fc4774f'),
        begin: ethers.utils.getAddress('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0x21789cddc9c451d2b290c33e4c0763bed2d6e1de'),
        begin: ethers.utils.getAddress('0x350439163de624418d79ca593746932c33339d8f'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
    ]
    let sAx = [
      {
        address: ethers.utils.getAddress('0xb8875e207ee8096a929d543c9981c9586992eacb'),
        begin: ethers.utils.getAddress('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0x0e2bf23d6c7ff091c0447b79fe7c64b323d4ab13'),
        begin: ethers.utils.getAddress('0xd955ff9e2ace6afdb080ff21ba8892035956fce2'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
    ]
    let sAy = [
      {
        address: ethers.utils.getAddress('0xd9a0d1f5e02de2403f68bb71a15f8847a854b494'),
        begin: ethers.utils.getAddress('0x2170ed0880ac9a755fd29b2688956bd959f933f8'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0x1414b8b96fe704317c4ec9c087d8057610fa75fb'),
        begin: ethers.utils.getAddress('0x984b517e728d67ae5c1f298eec28193d6d97605f'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
    ]
    let sXb = [
      {
        address: ethers.utils.getAddress('0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458'),
        begin: ethers.utils.getAddress('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0x1f4eee6c7a232ebc7b47510e68308010afdfdfc0'),
        begin: ethers.utils.getAddress('0x5ada7f5570b873c61c7157cb1ecdb40654e5d49a'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
    ]
    let sYb = [
      {
        address: ethers.utils.getAddress('0x8049ebf75c83b3d7595511527a44a34972a3b8e4'),
        begin: ethers.utils.getAddress('0x2859e4544c4bb03966803b044a93563bd2d0dd4d'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0x145748be6628027631310188986dc10b1b5feb05'),
        begin: ethers.utils.getAddress('0x6528614660a36f2d890c1ba4d9a58cdafee68cb4'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
    ]
    let sXy = [
      {
        address: ethers.utils.getAddress('0x680dd100e4b394bda26a59dd5c119a391e747d18'),
        begin: ethers.utils.getAddress('0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
      {
        address: ethers.utils.getAddress('0x0f71072676fa4de29d9cdb6e078f5e19608432b1'),
        begin: ethers.utils.getAddress('0xde65f45aa0c9a85e714e22f246402fde741a298f'),
        end: ethers.utils.getAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        creator: ethers.utils.getAddress('0xbcfccbde45ce874adcb698cc183debcf17952812'),
      },
    ]
    let { ab, ax, ay, xb, yb, xy } = await service.loadRouteSteps({sAb, sAx, sAy, sXb, sYb, sXy})
    let actualPoolAddressAb = ab.map((step) => step.address)
    let expectedPoolAddressAb = [ethers.utils.getAddress('0x1b96b92314c44b159149f7e0303511fb2fc4774f')]
    let actualPoolAddressAx = ax.map((step) => step.address)
    let expectedPoolAddressAx = [ethers.utils.getAddress('0xb8875e207ee8096a929d543c9981c9586992eacb')]
    let actualPoolAddressAy = ay.map((step) => step.address)
    let expectedPoolAddressAy = [ethers.utils.getAddress('0xd9a0d1f5e02de2403f68bb71a15f8847a854b494')]
    let actualPoolAddressxB = xb.map((step) => step.address)
    let expectedPoolAddressxB = [ethers.utils.getAddress('0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458')]
    let actualPoolAddressYb = yb.map((step) => step.address)
    let expectedPoolAddressYb = [ethers.utils.getAddress('0x8049ebf75c83b3d7595511527a44a34972a3b8e4')]
    let actualPoolAddressXy = xy.map((step) => step.address)
    let expectedPoolAddressXy = [ethers.utils.getAddress('0x680dd100e4b394bda26a59dd5c119a391e747d18')]
    assert.deepStrictEqual(actualPoolAddressAb, expectedPoolAddressAb)
    assert.deepStrictEqual(actualPoolAddressAx, expectedPoolAddressAx)
    assert.deepStrictEqual(actualPoolAddressAy, expectedPoolAddressAy)
    assert.deepStrictEqual(actualPoolAddressxB, expectedPoolAddressxB)
    assert.deepStrictEqual(actualPoolAddressYb, expectedPoolAddressYb)
    assert.deepStrictEqual(actualPoolAddressXy, expectedPoolAddressXy)
  })
})
