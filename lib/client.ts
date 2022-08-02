import crypto from 'crypto'
import { Exchange } from './exchange'
import { getPools } from './contract_helper_service'
import { BigNumber, ethers } from 'ethers'
import Joi from 'joi'
import { getPoolsByTopTokenReserve } from './swap_service'
import { Pool } from './get_pools_by_top_token_reserve_result'
import { bufferToAddress, hexToBuffer } from './formatter'
import { makeTupleCombination } from './combination'
import { bscEndpoint, contractHelper, swapEndpoint } from './configs'
import _ from 'lodash'
import { EXCHANGE_ADDRESS_MAP, getPoolAddress } from './bsc_utils'

const ALL_EXCHANGES = [
  Exchange.PANCAKE,
  Exchange.PANCAKE2,
  Exchange.JUL,
  Exchange.APE,
  Exchange.BI,
  Exchange.MDEX,
  Exchange.CAFE,
  Exchange.JET,
  Exchange.BABY,
]
const LAST_ETH_ADDRESS = ethers.utils.getAddress('0xffffffffffffffffffffffffffffffffffffffff')

type RouteStep = {
  beginAddress: string
  endAddress: string
  beginReserve: BigNumber
  endReserve: BigNumber
  address: string
  creator: string
  _identity?: string
}

type AllRouteSteps = {
  ab: RouteStep[]
  ax: RouteStep[]
  ay: RouteStep[]
  xb: RouteStep[]
  yb: RouteStep[]
  xy: RouteStep[]
}

type MissingStep = {
  address: string
  begin: string
  end: string
  creator: string
}

type AllMissingSteps = {
  sAb: MissingStep[]
  sAx: MissingStep[]
  sAy: MissingStep[]
  sXb: MissingStep[]
  sYb: MissingStep[]
  sXy: MissingStep[]
}

export type EvaluatedRoute = {
  liquidity: BigNumber
  route: RouteStep[]
}

type LoadStepOptions = {
  exchanges: (keyof typeof Exchange)[]
  sourceTokenQuantity: number
  targetTokenQuantity: number
}

export type RouteOption = {
  swapEndpoint: string
  bscEndpoint: string
  contractHelper: string

  limit: number
  sourceTokenQuantity: number
  targetTokenQuantity: number
  weight: number
  exchanges: (keyof typeof Exchange)[]
}

const getRoutesOptions = (data: Partial<RouteOption>) => {
  const validationResult = Joi.object()
    .keys({
      contractHelper: Joi.string().default(contractHelper),
      swapEndpoint: Joi.string().default(swapEndpoint),
      bscEndpoint: Joi.string().default(bscEndpoint),
      
      limit: Joi.number().integer().min(1).default(1),
      sourceTokenQuantity: Joi.number().integer().min(1).max(16).default(1),
      targetTokenQuantity: Joi.number().integer().min(1).max(16).default(1),
      weight: Joi.number().min(0).max(1).default(1),
      exchanges: Joi.array()
        .items(Joi.string().valid(...ALL_EXCHANGES))
        .default(ALL_EXCHANGES),
    })
    .validate(data)
  
  if (validationResult.error) {
    throw new Error(validationResult.error.message)
  }
  return validationResult.value as RouteOption
}

export const createClient = (options: Partial<RouteOption>) => {
  const validatedOptions = getRoutesOptions(options)

  const loadRouteSteps = async ({ sAb, sAx, sAy, sXb, sXy, sYb }: AllMissingSteps) => {
    const poolAddresses = [sAb, sAx, sAy, sXb, sYb, sXy]
      .map((steps) => {
        return steps.map((s) => s.address)
      })
      .flat()
    const poolMap = await getPools({
      endpoint: validatedOptions.bscEndpoint,
      address: validatedOptions.contractHelper,
    })(poolAddresses)
    return {
      ab: _makeRouteStepsFromReserves(sAb, poolMap),
      ax: _makeRouteStepsFromReserves(sAx, poolMap),
      ay: _makeRouteStepsFromReserves(sAy, poolMap),
      xb: _makeRouteStepsFromReserves(sXb, poolMap),
      yb: _makeRouteStepsFromReserves(sYb, poolMap),
      xy: _makeRouteStepsFromReserves(sXy, poolMap),
    }
  }

  const _loadSteps = async (
    poolMap: Map<string, Pool[]>,
    source: string,
    target: string,
    options: LoadStepOptions,
  ) => {
    const { x, y } = _getIntermediateTokens(poolMap, source, target)
    const limitedX = x.slice(0, options.sourceTokenQuantity)
    const limitedY = y.slice(0, options.targetTokenQuantity)
    const { sAb, sAx, sAy, sXb, sYb, sXy } = _makeMissingSteps(
      source,
      target,
      limitedX,
      limitedY,
      options.exchanges,
    )
    return await loadRouteSteps({ sAb, sAx, sAy, sXb, sYb, sXy })
  }

  const getRoutes = async (source: string, target: string, options?: RouteOption) => {
    const defaultedOptions = getRoutesOptions({ ...validatedOptions, ...options })
    if (source === target) {
      throw new Error('source and target: expect difference')
    }
    const poolMap = await getPoolsByTopTokenReserve({ endpoint: defaultedOptions.swapEndpoint })([
      source,
      target,
    ])
    const loadStepsOptions = {
      sourceTokenQuantity: defaultedOptions.sourceTokenQuantity,
      targetTokenQuantity: defaultedOptions.targetTokenQuantity,
      exchanges: defaultedOptions.exchanges,
    }
    const { ab, ax, ay, yb, xb, xy } = await _loadSteps(poolMap, source, target, loadStepsOptions)
    const routes = _makeRoutes({ ab, ax, ay, yb, xb, xy })
    const evaluatedRoutes = _evaluateAndSortRoutes(routes, defaultedOptions.weight)
    return evaluatedRoutes.slice(0, defaultedOptions.limit)
  }

  return {
    getRoutes,
    loadRouteSteps,
  }
}

function _makeRouteStepsFromReserves(
  missingSteps: MissingStep[],
  poolMap: Map<string, { address: string; reserve0: BigNumber; reserve1: BigNumber }>,
) {
  return missingSteps
    .map((step) => {
      const poolAdress = ethers.utils.getAddress(step.address)
      const pool = poolMap.get(poolAdress)
      if (pool == undefined) {
        return undefined
      }
      const { beginReserve, endReserve } = _getStepReserves(step.begin, step.end, pool)
      return {
        address: step.address,
        beginAddress: step.begin,
        endAddress: step.end,
        beginReserve: beginReserve,
        endReserve: endReserve,
        creator: step.creator,
      }
    })
    .filter(
      (
        s,
      ): s is {
        address: string
        beginAddress: string
        endAddress: string
        beginReserve: BigNumber
        endReserve: BigNumber
        creator: string
      } => s !== undefined,
    )
}

function _getStepReserves(
  begin: string,
  end: string,
  pool: { address: string; reserve0: BigNumber; reserve1: BigNumber },
) {
  if (begin < end) {
    return { beginReserve: pool.reserve0, endReserve: pool.reserve1 }
  } else {
    return { beginReserve: pool.reserve1, endReserve: pool.reserve0 }
  }
}

export function _getIntermediateTokens(poolMap: Map<string, Pool[]>, source: string, target: string) {
  const x = _getIntermediateTokensFromSource(poolMap, source)
  const y = _getIntermediateTokensFromTarget(poolMap, target)
  return { x, y }
}

function _getIntermediateTokensFromSource(poolMap: Map<string, Pool[]>, source: string) {
  const heximalSource = source
  const pools = poolMap.get(heximalSource)
  if (pools === undefined) {
    return []
  }
  const sortedPools = _sortPoolsByReserve(pools, source)
  const tokens = sortedPools
    .map((pool) => {
      if (pool.address0 === source) {
        return pool.address1
      }
      if (pool.address1 === source) {
        return pool.address0
      }
      return undefined
    })
    .filter((s: string | undefined): s is string => !!Boolean(s))
  return _getUniqueAddresses(tokens)
}

function _getIntermediateTokensFromTarget(poolMap: Map<string, Pool[]>, target: string) {
  const heximalTarget = target
  const pools = poolMap.get(heximalTarget)
  if (pools === undefined) {
    return []
  }
  const sortedPools = _sortPoolsByReserve(pools, target)
  const tokens = sortedPools
    .map((pool) => {
      if (pool.address0 === target) {
        return pool.address1
      }
      if (pool.address1 === target) {
        return pool.address0
      }
      return undefined
    })
    .filter((item): item is string => item !== undefined)
  return _getUniqueAddresses(tokens)
}

function _sortPoolsByReserve(pools: Pool[], token: string) {
  const list = pools.map((pool) => {
    return {
      pool: pool,
      reserve: pool.address0 === token ? pool.reserve0 : pool.reserve1,
    }
  })
  list.sort((a, b) => {
    const delta = b.reserve.sub(a.reserve)
    if (delta.eq(0)) {
      return 0
    }
    return delta.gt(0) ? 1 : -1
  })
  return list.map((item) => item.pool)
}

function _getUniqueAddresses(addresses: string[]) {
  const entries = addresses.map((a) => [ethers.utils.getAddress(a), a] as [string, string])
  const map = new Map(entries)
  return Array.from(map.values())
}

export function _makeMissingSteps(a: string, b: string, x: string[], y: string[], exchanges: string[]) {
  return {
    sAb: _makeMissingStepsOnExchanges(a, b, exchanges),
    sAx: _makeMissingStepsOneToMany(a, x, exchanges),
    sAy: _makeMissingStepsOneToMany(a, y, exchanges),
    sXb: _makeMissingStepsManyToOne(x, b, exchanges),
    sYb: _makeMissingStepsManyToOne(y, b, exchanges),
    sXy: _makeMissingStepsManyToMany(x, y, exchanges),
  }
}

function _makeMissingStepsOneToMany(begin: string, endList: string[], exchanges: string[]) {
  return endList
    .map((end) => {
      return _makeMissingStepsOnExchanges(begin, end, exchanges)
    })
    .flat()
}

function _makeMissingStepsManyToOne(beginList: string[], end: string, exchanges: string[]) {
  return beginList
    .map((begin) => {
      return _makeMissingStepsOnExchanges(begin, end, exchanges)
    })
    .flat()
}

function _makeMissingStepsManyToMany(beginList: string[], endList: string[], exchanges: string[]) {
  const stepsList: {
    address: any
    begin: string
    end: string
    creator: any
  }[][] = []
  for (const begin of beginList) {
    for (const end of endList) {
      const step = _makeMissingStepsOnExchanges(begin, end, exchanges)
      stepsList.push(step)
    }
  }
  return stepsList.flat()
}

export function _makeMissingStepsOnExchanges(begin: string, end: string, exchanges: string[]) {
  if (begin === end) {
    return []
  }
  return exchanges.map((exchange) => {
    const creatorBuffer = Buffer.from(EXCHANGE_ADDRESS_MAP[exchange].factoryAddress)
    if (creatorBuffer === undefined) {
      throw new Error(`unkown address of exchange: ${exchange}`)
    }
    const creator = bufferToAddress(creatorBuffer)
    const addressBuffer = getPoolAddress(exchange, begin, end)
    const address = bufferToAddress(addressBuffer)
    return { address, begin, end, creator }
  })
}

function _makeRoutes({ ab, ax, ay, xb, xy, yb }: AllRouteSteps) {
  const rAb = _makeRouteAb(ab)
  const rAxb = _makeRoutesAxb(ax, xb)
  const rAyb = _makeRoutesAyb(ay, yb)
  const rAxyb = _makeRoutesAxyb(ax, xy, yb)
  const routes = [...rAb, ...rAxb, ...rAyb, ...rAxyb]
  const goodRoutes = _removeBadRoutes(routes)
  return _removeDuplicatedRoutes(goodRoutes)
}

function _makeRouteAb(stepsAb: RouteStep[]) {
  return stepsAb.map((step) => [step])
}

function _makeRoutesAxb(stepsAx: RouteStep[], stepsXb: RouteStep[]) {
  return makeTupleCombination(stepsAx, stepsXb).filter((r) => _isLinkedRoute(r))
}

function _makeRoutesAyb(stepsAy: RouteStep[], stepsYb: RouteStep[]) {
  return makeTupleCombination(stepsAy, stepsYb).filter((r) => _isLinkedRoute(r))
}

function _makeRoutesAxyb(stepsAx: RouteStep[], stepsXy: RouteStep[], stepsYb: RouteStep[]) {
  return makeTupleCombination(stepsAx, stepsXy, stepsYb).filter((r) => _isLinkedRoute(r))
}

function _removeBadRoutes(routes: RouteStep[][]) {
  return routes.filter((route) => {
    return route === undefined || !_isBadRoute(route)
  })
}

function _isBadRoute(route: RouteStep[]) {
  const poolList = route.map((r) => ethers.utils.getAddress(r.address))
  const poolSet = new Set(poolList)
  return poolSet.size < poolList.length
}

function _removeDuplicatedRoutes(routes: RouteStep[][]) {
  return _(routes).uniqBy(_makeRouteIdentity).value()
}

function _makeRouteIdentity(route: RouteStep[]) {
  const hash = crypto.createHash('sha256')
  for (const step of route) {
    const creator = step.creator || LAST_ETH_ADDRESS
    const input = Buffer.concat([
      hexToBuffer(step.beginAddress),
      hexToBuffer(step.endAddress),
      hexToBuffer(creator),
    ])
    hash.update(input)
  }
  return '0x' + hash.digest('hex')
}

function _isLinkedRoute(route: RouteStep[]) {
  if (route.length <= 1) {
    return true
  }
  for (let i = 0; i < route.length - 1; ++i) {
    const s0 = route[i]
    const s1 = route[i + 1]
    if ((s0.endAddress === s1.beginAddress) === false) {
      return false
    }
  }
  return true
}

function _evaluateAndSortRoutes(routes: RouteStep[][], weight: number) {
  const evaluatedRoutes = _evaluateRoutes(routes)
  return _sortRoutesByLiquidity(evaluatedRoutes, weight)
}

function _evaluateRoutes(routes: RouteStep[][]) {
  return routes.map(_evaluateRoute)
}

function _evaluateRoute(route: RouteStep[]) {
  const e1 = _validateLinkedRoute(route)
  if (e1) {
    throw new Error(e1)
  }
  const liquidity = _calculateRouteLiquidity(route)
  return {
    route: route,
    liquidity,
  }
}

function _validateLinkedRoute(route: RouteStep[]) {
  return _isLinkedRoute(route) === false ? 'expect linked route' : undefined
}

function _calculateRouteLiquidity(route: RouteStep[]) {
  if (route.length === 0) {
    return BigNumber.from(0)
  }
  let result = _isFakeRouteStep(route[0]) ? BigNumber.from(1) : BigNumber.from(route[0].endReserve)
  for (let i = 1; i < route.length; ++i) {
    const step = route[i]
    if (_isFakeRouteStep(step)) {
      continue
    }
    if (result.lt(step.beginReserve)) {
      result = result.mul(step.endReserve).div(step.beginReserve)
    } else {
      result = BigNumber.from(step.endReserve)
    }
  }
  return result
}

function _isFakeRouteStep(step: RouteStep) {
  return step.beginReserve === undefined || step.endReserve === undefined
}

function _sortRoutesByLiquidity(routes: EvaluatedRoute[], weight: number) {
  const decimal = 1000000
  for (const route of routes) {
    const coefficient = Math.pow(weight, route.route.length - 1)
    const multipler = Math.floor(decimal * coefficient)
    route['_liquidityW'] = route.liquidity.mul(multipler).div(decimal)
  }
  const result = routes.sort((a, b) => {
    if (a['_liquidityW'].gt(b['_liquidityW'])) {
      return -1
    } else if (a['_liquidityW'].lt(b['_liquidityW'])) {
      return 1
    } else {
      return 0
    }
  })
  for (const route of routes) {
    delete route['_liquidityW']
  }
  return result
}
