'use strict'

const crypto = require('crypto')
const {
    getExchangeAddress,
    getPoolAddress,
    ExchangeName
} = require('bsc_util')
const {ClientConfiguration} = require('./client_configuration')
const {
    SwapService, GetPoolsByTopTokenReserveResult
} = require('./swap_service')
const {
    ContractHelperService, ContractHelperPoolMap
} = require('./contract_helper_service')
const {makeTupleCombination} = require('./combination')
const {ContractHelperPool} = require('./contract_helper_result')
const {validateInteger, validateFloat} = require('./validator')
const {mapObject} = require('./formatter')
const {Address} = require('./address')
const {Buffer} = require('./buffer')
const {BigNumber} = require('./bignumber')
const {BigFractionNumber} = require('./big_fraction_number')
const {Heximal} = require('./heximal')

const ALL_EXCHANGES = [
    ExchangeName.PANCAKE,
    ExchangeName.PANCAKE2,
    ExchangeName.BAKERY,
    ExchangeName.JUL,
    ExchangeName.APE,
    ExchangeName.BI,
    ExchangeName.MDEX,
    ExchangeName.CAFE,
    ExchangeName.JET,
    ExchangeName.BABY
]
const LAST_ETH_ADDRESS = Address.fromHeximal(
    '0xffffffffffffffffffffffffffffffffffffffff'
)

/**
 * @typedef {object} GetRoutesWeakOptions
 * @property {number} [limit] - Quantity of returned routes at maximum.
 * @property {number} [sourceTokenQuantity] - Quantity of intermediate tokens
 * from source token. It must be less than or equal 16.
 * @property {number} [targetTokenQuantity] - Quantity of intermediate tokens
 * to target token. It must be less than or euqal 16.
 * @property {number} [weight] - ?, in range [0, 1].
 * @property {Array<ExchangeName>} exchanges - Routes go through these
 * exchanges.
 */

/**
 * An exchange from token `beginAddress` to `endAddress`.
 *
 * @typedef {object} RouteStep
 * @property {Address} beginAddress
 * @property {Address} endAddress
 * @property {BigNumber} beginReserve - Amount of token `beginAddress`.
 * @property {BigNumber} endReserve - Amount of token `endAddress`.
 * @property {Address} address - Address of pool.
 * @property {Address} creator - Address of creator.
 */

/**
 * @typedef {object} AllRouteSteps
 * @property {Array<RouteStep>} ab
 * @property {Array<RouteStep>} ax
 * @property {Array<RouteStep>} ay
 * @property {Array<RouteStep>} xb
 * @property {Array<RouteStep>} yb
 * @property {Array<RouteStep>} xy
 */

/**
 * @typedef {object} MissingStep
 * @property {Address} address
 * @property {Address} begin
 * @property {Address} end
 * @property {Address} creator
 */

/**
 * @typedef {object} AllMissingSteps
 * @property {Array<MissingStep>} sAb
 * @property {Array<MissingStep>} sAx
 * @property {Array<MissingStep>} sAy
 * @property {Array<MissingStep>} sXb
 * @property {Array<MissingStep>} sYb
 * @property {Array<MissingStep>} sXy
 */

/**
 * @typedef {object} IntermediateTokenMap
 * @property {Array<Address>} x - Unique addresses.
 * @property {Array<Address>} y - Unique addresses.
 */

/**
 * @typedef {Array<RouteStep>} Route
 * @property {Heximal} _identity - 32 bytes.
 */

/**
 * @typedef {object} EvaluatedRoute
 * @property {BigNumber} liquidity
 * @property {Route} route
 */

/**
 * @typedef {object} StepReserves
 * @property {BigNumber} beginReserve
 * @property {BigNumber} endReserve
 */

/**
 * @private
 */
class GetRoutesOptions {
    /**
     *
     * @param {object} data
     * @param {number} data.limit
     * @param {number} data.sourceTokenQuantity
     * @param {number} data.targetTokenQuantity
     * @param {number} data.weight
     * @param {Array<ExchangeName>} data.exchanges
     */
    constructor(data) {
        this.limit = data.limit
        this.sourceTokenQuantity = data.sourceTokenQuantity
        this.targetTokenQuantity = data.targetTokenQuantity
        this.weight = data.weight
        this.exchanges = data.exchanges
    }

    /**
     *
     * @param {GetRoutesWeakOptions} data
     * @return {GetRoutesOptions}
     * @throws {TypeError}
     */
    static fromWeakData(data) {
        let realData = Object.assign({
            limit: 1,
            sourceTokenQuantity: 1,
            targetTokenQuantity: 1,
            weight: 1.0,
            exchanges: ALL_EXCHANGES
        }, data)
        let e1 = validateInteger(realData.limit, 1)
        if (e1) {
            throw new TypeError(`limit: ${e1}`)
        }
        let e2 = validateInteger(realData.sourceTokenQuantity, 1, 16)
        if (e2) {
            throw new TypeError(`sourceTokenQuantity: ${e2}`)
        }
        let e3 = validateInteger(realData.targetTokenQuantity, 1, 16)
        if (e3) {
            throw new TypeError(`targetTokenQuantity: ${e3}`)
        }
        let e4 = validateFloat(realData.weight, 0, 1)
        if (e4) {
            throw new TypeError(`weight: ${e4}`)
        }
        return new GetRoutesOptions(realData)
    }
}

class Client {
    /**
     * MUST NOT use this constructor, let use `create()`.
     *
     * @param {object} services
     * @param {SwapService} services.swapService
     * @param {ContractHelperService} services.contractHelperService
     */
    constructor(services) {
        this._swapService = services.swapService
        this._contractHelperService = services.contractHelperService
    }

    /**
     *
     * @param {object} options
     * @param {string} [options.swapEndpoint]
     * @param {string} [options.bscEndpoint]
     * @param {string} [options.contractHelper]
     * @return {Client}
     * @throws {TypeError}
     */
    static create(options) {
        let config = ClientConfiguration.fromObject(options)
        let swapService = SwapService.create({
            endpoint: config.swapEndpoint
        })
        let contractHelperService = ContractHelperService.create({
            endpoint: config.bscEndpoint,
            address: config.contractHelper
        })
        return new Client({
            swapService,
            contractHelperService
        })
    }

    /**
     *
     * @param {Heximal} source
     * @param {Heximal} target
     * @param {GetRoutesWeakOptions} options
     * @return {Promise<Array<Route>>}
     * @throws {Error}
     */
    async getRoutes(source, target, options = {}) {
        let inputData = {source, target, options}
        let input = mapObject(inputData, [
            ['source', Address.fromHeximal],
            ['target', Address.fromHeximal],
            ['options', GetRoutesOptions.fromWeakData]
        ])
        if (input.source.eq(input.target)) {
            throw new Error('source and target: expect difference')
        }
        let poolMap = await this._swapService.getPoolsByTopTokenReserve([
            input.source, input.target
        ])
        let {ab, ax, ay, yb, xb, xy} = await this._loadSteps(
            poolMap, input.source, input.target, input.options.exchanges
        )
        let originRoutes = _makeRoutes(ab, ax, ay, yb, xb, xy)
        let extraRoutes = []
        let routes = _mergeRoutesLists(originRoutes, extraRoutes)
        return _evaluateAndSortRoutes(routes, input.options.weight)
    }

    /**
     * @private
     * @param {GetPoolsByTopTokenReserveResult} poolMap
     * @param {Address} source
     * @param {Address} target
     * @param {Array<ExchangeName>} exchanges
     * @return {Promise<AllRouteSteps>}
     */
    async _loadSteps(poolMap, source, target, exchanges) {
        let {x, y} = _getIntermediateTokens(poolMap, source, target)
        let {sAb, sAx, sAy, sXb, sYb, sXy} = _makeMissingSteps(
            source, target, x, y, exchanges
        )
        return await this._loadRouteSteps(
            sAb, sAx, sAy, sXb, sYb, sXy
        )
    }

    /**
     * If a step is not existed onchain then exclude it from the result.
     *
     * @private
     * @param {Array<MissingStep>} sAb
     * @param {Array<MissingStep>} sAx
     * @param {Array<MissingStep>} sAy
     * @param {Array<MissingStep>} sXb
     * @param {Array<MissingStep>} sYb
     * @param {Array<MissingStep>} sXy
     * @return {Promise<AllRouteSteps>}
     */
    async _loadRouteSteps(sAb, sAx, sAy, sXb, sYb, sXy) {
        let poolAddresses = [sAb, sAx, sAy, sXb, sYb, sXy]
            .map(steps => {
                return steps.map(s => s.address)
            })
            .flat()
        let poolMap = await this._contractHelperService.getPools(
            poolAddresses
        )
        return {
            ab: _makeRouteStepsFromReserves(sAb, poolMap),
            ax: _makeRouteStepsFromReserves(sAx, poolMap),
            ay: _makeRouteStepsFromReserves(sAy, poolMap),
            xb: _makeRouteStepsFromReserves(sXb, poolMap),
            yb: _makeRouteStepsFromReserves(sYb, poolMap),
            xy: _makeRouteStepsFromReserves(sXy, poolMap)
        }
    }
}

/**
 *
 * @param {Array<MissingStep>} missingSteps
 * @param {ContractHelperPoolMap} poolMap
 * @return {Array<RouteStep>}
 */
function _makeRouteStepsFromReserves(missingSteps, poolMap) {
    return missingSteps
        .map(step => {
            let poolAdress = step.address.toHeximal()
            let pool = poolMap.get(poolAdress)
            if (pool === undefined) {
                return undefined
            }
            let {beginReserve, endReserve} = _getStepReserves(
                step.begin, step.end, pool
            )
            return {
                address: step.address,
                beginAddress: step.begin,
                endAddress: step.end,
                beginReserve: beginReserve,
                endReserve: endReserve,
                creator: step.creator
            }
        })
        .filter(s => (s !== undefined))
}

/**
 *
 * @param {Address} begin
 * @param {Address} end
 * @param {ContractHelperPool} pool
 * @return {StepReserves}
 */
function _getStepReserves(begin, end, pool) {
    if (begin.lt(end)) {
        return {beginReserve: pool.reserve0, endReserve: pool.reserve1}
    }
    else {
        return {beginReserve: pool.reserve1, endReserve: pool.reserve0}
    }
}

/**
 *
 * @param {GetPoolsByTopTokenReserveResult} poolMap
 * @param {Address} source
 * @param {Address} target
 * @return {IntermediateTokenMap}
 */
function _getIntermediateTokens(poolMap, source, target) {
    let x = _getIntermediateTokensFromSource(poolMap, source)
    let y = _getIntermediateTokensFromTarget(poolMap, target)
    return {x, y}
}

/**
 *
 * @param {GetPoolsByTopTokenReserveResult} poolMap
 * @param {Address} source
 * @return {Array<Address>}
 */
function _getIntermediateTokensFromSource(poolMap, source) {
    let heximalSource = source.toHeximal()
    let pools = poolMap.get(heximalSource)
    if (pools === undefined) {
        return []
    }
    let tokens = pools
        .map(pool => {
            if (pool.address0.eq(source)) {
                return pool.address1
            }
            if (pool.address1.eq(source)) {
                return pool.address0
            }
            return undefined
        })
        .filter(item => (item !== undefined))
    return _getUniqueAddresses(tokens)
}

/**
 *
 * @param {GetPoolsByTopTokenReserveResult} poolMap
 * @param {Address} target
 * @return {Array<Address>}
 */
function _getIntermediateTokensFromTarget(poolMap, target) {
    let heximalTarget = target.toHeximal()
    let pools = poolMap.get(heximalTarget)
    if (pools === undefined) {
        return []
    }
    let tokens = pools
        .map(pool => {
            if (pool.address0.eq(target)) {
                return pool.address1
            }
            if (pool.address1.eq(target)) {
                return pool.address0
            }
            return undefined
        })
        .filter(item => (item !== undefined))
    return _getUniqueAddresses(tokens)
}

/**
 *
 * @param {Array<Address>} addresses
 * @return {Array<Address>}
 */
function _getUniqueAddresses(addresses) {
    let entries = addresses.map(a => [a.toHeximal(), a])
    let map = new Map(entries)
    return Array.from(map.values())
}

/**
 *
 * @param {Address} a
 * @param {Address} b
 * @param {Array<Address>} x
 * @param {Array<Address>} y
 * @param {Array<ExchangeName>} exchanges
 * @return {AllMissingSteps}
 */
function _makeMissingSteps(a, b, x, y, exchanges) {
    return {
        sAb: _makeMissingStepsOnExchanges(a, b, exchanges),
        sAx: _makeMissingStepsOneToMany(a, x, exchanges),
        sAy: _makeMissingStepsOneToMany(a, y, exchanges),
        sXb: _makeMissingStepsManyToOne(x, b, exchanges),
        sYb: _makeMissingStepsManyToOne(y, b, exchanges),
        sXy: _makeMissingStepsManyToMany(x, y, exchanges)
    }
}

/**
 *
 * @param {Address} begin
 * @param {Array<Address>} endList
 * @param {Array<ExchangeName>} exchanges
 * @return {Array<MissingStep>}
 */
function _makeMissingStepsOneToMany(begin, endList, exchanges) {
    return endList
        .map(end => {
            return _makeMissingStepsOnExchanges(begin, end, exchanges)
        })
        .flat()
}

/**
 *
 * @param {Array<Address>} beginList
 * @param {Address} end
 * @param {Array<ExchangeName>} exchanges
 * @return {Array<MissingStep>}
 */
function _makeMissingStepsManyToOne(beginList, end, exchanges) {
    return beginList
        .map(begin => {
            return _makeMissingStepsOnExchanges(begin, end, exchanges)
        })
        .flat()
}

/**
 *
 * @param {Array<Address>} beginList
 * @param {Array<Address>} endList
 * @param {Array<ExchangeName>} exchanges
 * @return {Array<MissingStep>}
 */
function _makeMissingStepsManyToMany(beginList, endList, exchanges) {
    let stepsList = []
    for (let begin of beginList) {
        for (let end of endList) {
            let step = _makeMissingStepsOnExchanges(begin, end, exchanges)
            stepsList.push(step)
        }
    }
    return stepsList.flat()
}

/**
 *
 * @param {Address} begin
 * @param {Address} end
 * @param {Array<ExchangeName>} exchanges
 * @return {Array<MissingStep>}
 */
function _makeMissingStepsOnExchanges(begin, end, exchanges) {
    if (begin.eq(end)) {
        return []
    }
    return exchanges.map(exchange => {
        let creatorBuffer = getExchangeAddress(exchange)
        if (creatorBuffer === undefined) {
            throw new Error(`unkown address of exchange: ${exchange}`)
        }
        let creator = Address.fromBuffer(creatorBuffer)
        let addressBuffer = getPoolAddress(
            exchange, begin.value, end.value
        )
        let address = Address.fromBuffer(addressBuffer)
        return {address, begin, end, creator}
    })
}

/**
 *
 * @param {Array<RouteStep>} ab
 * @param {Array<RouteStep>} ax
 * @param {Array<RouteStep>} ay
 * @param {Array<RouteStep>} xb
 * @param {Array<RouteStep>} yb
 * @param {Array<RouteStep>} xy
 * @return {Array<Route>}
 */
function _makeRoutes(ab, ax, ay, xb, yb, xy) {
    let rAb = _makeRouteAb(ab)
    let rAxb = _makeRoutesAxb(ax, xb)
    let rAyb = _makeRoutesAyb(ay, yb)
    let rAxyb = _makeRoutesAxyb(ax, xy, yb)
    let routes = [...rAb, ...rAxb, ...rAyb, ...rAxyb]
    let goodRoutes = _removeBadRoutes(routes)
    return _removeDuplicatedRoutes(goodRoutes)
}

/**
 *
 * @param {RouteStep} stepsAb
 * @return {Array<Route>}
 */
function _makeRouteAb(stepsAb) {
    return stepsAb.map(step => [step])
}

/**
 *
 * @param {Array<RouteStep>} stepsAx
 * @param {Array<RouteStep>} stepsXb
 * @return {Array<Route>}
 */
function _makeRoutesAxb(stepsAx, stepsXb) {
    return makeTupleCombination([stepsAx, stepsXb])
        .filter(r => _isLinkedRoute(r))
}

/**
 *
 * @param {Array<RouteStep>} stepsAy
 * @param {Array<RouteStep>} stepsYb
 * @return {Array<Route>}
 */
function _makeRoutesAyb(stepsAy, stepsYb) {
    return makeTupleCombination([stepsAy, stepsYb])
        .filter(r => _isLinkedRoute(r))
}

/**
 *
 * @param {Array<RouteStep>} stepsAx
 * @param {Array<RouteStep>} stepsXy
 * @param {Array<RouteStep>} stepsYb
 * @return {Array<Route>}
 */
function _makeRoutesAxyb(stepsAx, stepsXy, stepsYb) {
    return makeTupleCombination([stepsAx, stepsXy, stepsYb])
        .filter(r => _isLinkedRoute(r))
}

/**
 *
 * @param {Array<Route>} routes
 * @return {Array<Route>}
 */
function _removeBadRoutes(routes) {
    return routes.filter(route => {
        return (route === undefined) || !_isBadRoute(route)
    })
}

/**
 * A bad route has at least a duplicated step.
 *
 * @param {Route} route
 * @return {boolean}
 */
function _isBadRoute(route) {
    let poolList = route.map(r => r.address.toHeximal())
    let poolSet = new Set(poolList)
    return (poolSet.size < poolList.length)
}

/**
 *
 * @param {Array<Route>} routes
 * @return {Array<Route>}
 */
function _removeDuplicatedRoutes(routes) {
    let uniqueRoutes = []
    let routeSet = new Set()
    for (let route of routes) {
        let identity = _makeRouteIdentity(route)
        if (routeSet.has(identity)) {
            continue
        }
        route._identity = identity
        routeSet.add(identity)
        uniqueRoutes.push(route)
    }
    return uniqueRoutes
}

/**
 *
 * @param {Route} route
 * @return {Heximal} 32 bytes.
 */
function _makeRouteIdentity(route) {
    let hash = crypto.createHash('sha256')
    for (let step of route) {
        let creator = step.creator || LAST_ETH_ADDRESS
        let input = Buffer.concat([
            step.beginAddress.value,
            step.endAddress.value,
            creator.value
        ])
        hash.update(input)
    }
    return '0x' + hash.digest('hex')
}

/**
 *
 * @param {Route} route
 * @return {boolean}
 */
function _isLinkedRoute(route) {
    if (route.length <= 1) {
        return true
    }
    for (let i = 0; i < route.length - 1; ++i) {
        let s0 = route[i]
        let s1 = route[i + 1]
        if (s0.endAddress.eq(s1.beginAddress) === false) {
            return false
        }
    }
    return true
}

/**
 *
 * @param {...Array<Route>} routesList
 * @return {Array<Route>}
 */
function _mergeRoutesLists(...routesList) {
    let result = []
    let set = new Set()
    for (let routes of routesList) {
        for (let route of routes) {
            if (set.has(route._identity)) {
                continue
            }
            result.push(route)
            set.add(route._identity)
        }
    }
    return result
}

/**
 *
 * @param {Array<Route>} routes
 * @param {number} weight
 * @return {Array<EvaluatedRoute>}
 */
function _evaluateAndSortRoutes(routes, weight) {
    let evaluatedRoutes = _evaluateRoutes(routes)
    return _sortRoutesByLiquidity(evaluatedRoutes, weight)
}

/**
 *
 * @param {Array<Route>} routes
 * @return {Array<EvaluatedRoute>}
 */
function _evaluateRoutes(routes) {
    return routes.map(_evaluateRoute)
}

/**
 *
 * @param {Route} route
 * @return {EvaluatedRoute}
 * @throws {TypeError}
 */
function _evaluateRoute(route) {
    let e1 = _validateLinkedRoute(route)
    if (e1) {
        throw new TypeError(e1)
    }
    let liquidity = _calculateRouteLiquidity(route)
    return {
        route: route,
        liquidity: liquidity.toBigNumber()
    }
}

/**
 *
 * @param {Route} route
 * @return {undefined | string}
 * @throws {Error}
 */
function _validateLinkedRoute(route) {
    return (_isLinkedRoute(route) === false)
        ? 'expect linked route'
        : undefined
}

/**
 *
 * @param {Route} route
 * @return {BigFractionNumber}
 */
function _calculateRouteLiquidity(route) {
    if (route.length === 0) {
        return new BigFractionNumber(0, 1)
    }
    let result = _isFakeRouteStep(route[0])
        ? new BigFractionNumber(1, 1)
        : new BigFractionNumber(route[0].endReserve, 1)
    for (let i = 1; i < route.length; ++i) {
        let step = route[i]
        if (_isFakeRouteStep(step)) {
            continue
        }
        if (result.lt(step.beginReserve)) {
            result = result.mul(step.endReserve).div(step.beginReserve)
        }
        else {
            result = new BigFractionNumber(step.endReserve, 1)
        }
    }
    return result
}

/**
 *
 * @param {RouteStep} step
 * @return {boolean}
 */
function _isFakeRouteStep(step) {
    return (step.beginReserve === undefined) ||
        (step.endReserve === undefined)
}

/**
 *
 * @param {Array<EvaluatedRoute>} routes
 * @param {number} weight
 * @return {Array<EvaluatedRoute>}
 */
function _sortRoutesByLiquidity(routes, weight) {
    let decimal = 1000000
    for (let route of routes) {
        let coefficient = Math.pow(weight, route.route.length - 1)
        let multipler = Math.floor(decimal * coefficient)
        route['_liquidityW'] = route.liquidity.mul(multipler).div(decimal)
    }
    let result = routes.sort((a, b) => {
        if (a['_liquidityW'].gt(b['_liquidityW'])) {
            return -1
        }
        else if (a['_liquidityW'].lt(b['_liquidityW'])) {
            return 1
        }
        else {
            return 0
        }
    })
    for (let route of routes) {
        delete route['_liquidityW']
    }
    return result
}

module.exports = {
    Client,
    ExchangeName,
    _getIntermediateTokens,
    _makeMissingStepsOnExchanges,
    _makeMissingSteps
}