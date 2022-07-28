'use strict'

const {
    validateInstanceMap, validateObject, validateArray
} = require('./validator')
const {mapObject, mapArray} = require('./formatter')
const {Address} = require('./address')
const {BigNumber} = require('./bignumber')
const {Heximal} = require('./heximal')

/**
 * @private
 */
class Pool {
    /**
     *
     * @param {object} data
     * @param {Address} data.address
     * @param {Address} data.address0
     * @param {Address} data.address1
     * @param {Address} data.creator
     * @param {BigNumber} data.reserve0
     * @param {BigNumber} data.reserve1
     */
    constructor(data) {
        this.address = data.address
        this.address0 = data.address0
        this.address1 = data.address1
        this.creator = data.creator
        this.reserve0 = data.reserve0
        this.reserve1 = data.reserve1
    }

    /**
     *
     * @param {object} value
     * @param {Address} value.address
     * @param {Address} value.address0
     * @param {Address} value.address1
     * @param {Address} value.creator
     * @param {BigNumber} value.reserve0
     * @param {BigNumber} value.reserve1
     * @return {Pool}
     * @throws {TypeError}
     */
    static create(value) {
        let e1 = validateInstanceMap(value, [
            ['address', Address],
            ['address0', Address],
            ['address1', Address],
            ['creator', Address],
            ['reserve0', BigNumber],
            ['reserve1', BigNumber]
        ])
        if (e1) {
            throw new TypeError(e1)
        }
        return new Pool(value)
    }

    /**
     *
     * @param {object} value
     * @param {Heximal} value.address
     * @param {Heximal} value.address0
     * @param {Heximal} value.address1
     * @param {Heximal} value.creator
     * @param {Heximal} value.reserve0
     * @param {Heximal} value.reserve1
     * @return {GetPoolsByTopTokenReserveResult}
     * @throws {TypeError}
     */
    static fromApiResponse(value) {
        let data = mapObject(value, [
            ['address', Address.fromHeximal],
            ['address0', Address.fromHeximal],
            ['address1', Address.fromHeximal],
            ['creator', Address.fromHeximal],
            ['reserve0', BigNumber.fromHeximal],
            ['reserve1', BigNumber.fromHeximal]
        ])
        return new Pool(data)
    }
}

/**
 * Type `Map<Heximal, Array<Pool>>`, where key is token address and value
 * is list of pools which has `token0` or `token1` is the same as key.
 *
 * @private
 */
class GetPoolsByTopTokenReserveResult extends Map {
    /**
     * @param {Array<Array>} entries
     * @return {GetPoolsByTopTokenReserveResult}
     * @throws {TypeError}
     */
    static fromEntries(entries) {
        let e1 = validateArray(entries, Array)
        if (e1) {
            throw new TypeError(e1)
        }
        for (let i = 0; i < entries.length; ++i) {
            let e2 = GetPoolsByTopTokenReserveResult._validateEntry(entries[i])
            if (e2) {
                throw new TypeError(`[${i}]: ${e2}`)
            }
        }
        return new GetPoolsByTopTokenReserveResult(entries)
    }

    /**
     *
     * @param {string} value
     * @return {GetPoolsByTopTokenReserveResult}
     * @throws {TypeError}
     */
    static fromJsonString(value) {
        let data
        try {
            data = JSON.parse(value)
        }
        catch (error) {
            throw new TypeError('expect type string as JSON')
        }
        let e1 = validateObject(data)
        if (e1) {
            throw new TypeError(e1)
        }
        let tokenAddresses = Object.keys(data)
        let entries = tokenAddresses.map(address => {
            try {
                let pools = mapArray(data[address], Pool.fromApiResponse)
                return [address, pools]
            }
            catch (error) {
                throw new TypeError(`${address}: ${error.message}`)
            }
        })
        return new GetPoolsByTopTokenReserveResult(entries)
    }

    /**
     *
     * @param {Array} entry
     * @return {undefined | string}
     */
    static _validateEntry(entry) {
        let [key, value] = entry
        let e1 = Address.validateHeximal(key)
        if (e1) {
            return `[0]: ${e1}`
        }
        let e2 = validateArray(value, Pool)
        if (e2) {
            return `[1]: ${e2}`
        }
        return undefined
    }
}

module.exports = {
    Pool,
    GetPoolsByTopTokenReserveResult
}
