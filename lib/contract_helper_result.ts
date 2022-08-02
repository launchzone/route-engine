import { BigNumber, ethers } from 'ethers'

const POOL_NO_RESERVE = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)

export const createContractHelperPoolMap = ({
  reserves,
  addresses,
}: {
  reserves: BigNumber[][]
  addresses: string[]
}) => {
  if (reserves.length !== addresses.length) {
    throw new Error('expect quantity of reserves is equal addresses')
  }
  const entries: [string, { address: string; reserve0: BigNumber; reserve1: BigNumber }][] = []
  for (let i = 0; i < reserves.length; ++i) {
    const r = reserves[i]
    const [reserve0, reserve1] = r
    if (reserve0.eq(POOL_NO_RESERVE)) {
      continue
    }
    const address = ethers.utils.getAddress(addresses[i])
    const pool = {
      address,
      reserve0,
      reserve1,
    }
    entries.push([address, pool])
  }
  return new Map(entries)
}
