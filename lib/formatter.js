'use strict'

const {validateObject, validateArray} = require('./validator')

/**
 * `[0]` is name of attribute from source object. `[1]` is format function.
 * `[2]` is name of attribute in target object, `undefined` mean keep the
 * same attribute name from source object.
 *
 * @typedef {Array<string, Formatter, undefined | string>} MapObjectAction
 */

/**
 * @typedef {Function} Formatter
 * @function
 * @param {any} source
 * @return {any}
 * @throws {TypeError}
 */

/**
 * @param {object} source
 * @param {Array<MapObjectAction>} actions - This input is not validate.
 * Give a wrong value make messy error results.
 * @return {object}
 * @throws {TypeError}
 * @example
 * let source = {one: '1'}
 *
 * // Transform data only.
 * mapObject(source, [
 *     ['one', v => PInt.fromDecimal]
 * ])
 *
 * // Transform data and change attribute name `one` to `two`.
 * mapObject(souce, [
 *     ['one', v => PInt.fromDecimal, 'two']
 * ])
 *
 * // Set default value.
 * mapObject(source, [
 *     ['one', v => PInt.fromDecimal(v || '1')]
 * ])
 *
 * // Keep data no changes.
 * mapObject(source, [
 *     ['one', v => v]
 * ])
 */
function mapObject(source, actions) {
    let e1 = validateObject(source)
    if (e1) {
        throw new TypeError(`source: ${e1}`)
    }
    let target = {}
    for (let i = 0; i < actions.length; ++i) {
        let [sourceAttribute, formatter, newAttribute] = actions[i]
        let sourceValue = source[sourceAttribute]
        let targetAttribute = newAttribute || sourceAttribute
        try {
            target[targetAttribute] = formatter(sourceValue)
        }
        catch (error) {
            throw new TypeError(`${sourceAttribute}: ${error.message}`)
        }
    }
    return target
}

/**
 * @param {Array<any>} source
 * @param {Formatter} formatter - This input is not validate. Incorrect data
 * cause messy error reports.
 * @return {Array<any>}
 * @throws {TypeError}
 * @example
 * let source = [1, 2, 3]
 * let target = mapArray(source, v => {
 *     return v.toString()
 * })
 */
function mapArray(source, formatter) {
    let e1 = validateArray(source, 'any')
    if (e1) {
        throw new TypeError(e1)
    }
    let target = []
    for (let i = 0; i < source.length; ++i) {
        try {
            let item = formatter(source[i])
            target.push(item)
        }
        catch (error) {
            throw new TypeError(`[${i}]: ${error.message}`)
        }
    }
    return target
}

module.exports = {
    mapObject,
    mapArray
}
