import { BigNumber } from 'ethers'
import { tryCatch } from './trycatch'

export type Pool = {
  address: string
  address0: string
  address1: string
  creator: string
  reserve0: BigNumber
  reserve1: BigNumber
}

export const getPoolsByTopTokenReserveResultFromEntries = (entries: [string, Pool[]][]) => {
  return new Map(entries)
}

export const getPoolsByTopTokenReserveResultFromApi = (data: object) => {
  const tokenAddresses = Object.keys(data)

  const entries: [string, Pool[]][] = tokenAddresses.map((address) => {
    const [error, pools] = tryCatch(() =>
      data[address].map((value: any) => ({
        ...value,
        reserve0: BigNumber.from(value.reserve0),
        reserve1: BigNumber.from(value.reserve1),
      })),
    )
    if (error) throw error
    return [address, pools]
  })
  return new Map(entries)
}
