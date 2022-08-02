import Joi from 'joi'
import fetch from 'node-fetch'
import { getPoolsByTopTokenReserveResultFromApi } from './get_pools_by_top_token_reserve_result'
import qs from 'query-string'
import { ethers } from 'ethers'

export const getPoolsByTopTokenReserve =
  ({ endpoint }: { endpoint: string }) =>
  async (addresses: string[], limit: number = 8) => {
    await Joi.array().items(Joi.string()).min(1).max(16).required().validateAsync(addresses)
    const url = `${endpoint}/pool/top-token-reserve?${qs.stringify({
      a: addresses.map((a) => ethers.utils.getAddress(a)).join(','),
      l: limit,
    })}`
    const res = await fetch(url)
    if (res.status >= 400) {
      throw new Error(`${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    return getPoolsByTopTokenReserveResultFromApi(data)
  }
