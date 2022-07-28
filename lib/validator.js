'use strict'

/**
 *
 * @param {any} value
 * @return {undefined | string}
 */
function validateObject(value) {
    return (typeof(value) !== 'object') || (value === null)
        ? 'expect type object'
        : undefined
}

/**
 * Validate object attributes by type.
 *
 * @param {object} value - Object for validations.
 * @param {Array<string, Function  | string, boolean>} specs - List of
 * attribute specifications. `specs[][0]` is attribute name. `specs[][1]` is a
 * type, or a string, string mean primitive type such as `any`, `object`,
 * `number`, `boolean`. `specs[][2]` make optional attribute by `true`,
 * default is `false`.
 * @param {boolean} strict - If there are attributes which is not specify then
 * retun error.
 * @return {undefined | string}
 * @example
 * let object = {
 *     one: 1,
 *     two: 'two',
 *     buffer: Buffer.from([])
 * }
 * let result = validateInstanceMap(object, [
 *     ['one', 'number'],
 *     ['two', 'string'],
 *     ['buffer', Buffer]
 * ])
 */
function validateInstanceMap(value, specs, strict = true) {
    let e1 = validateObject(value)
    if (e1) {
        return e1
    }
    if (strict) {
        let attributes = specs.map(spec => spec[0])
        let e2 = validateAttributes(value, attributes)
        if (e2) {
            return e2
        }
    }
    for (let [name, type, optional] of specs) {
        let attributeValue = value[name]
        if (optional && attributeValue === undefined) {
            continue
        }
        let e3 = validateInstance(attributeValue, type)
        if (e3) {
            return `${name}: ${e3}`
        }
    }
    return undefined
}

/**
 * Check an object has not accepted attribute names.
 *
 * @param {object} value
 * @param {Array<string>} acceptedAttributes
 * @return {undefined | string}
 */
function validateAttributes(value, acceptedAttributes = []) {
    let objectAttributes = Object.getOwnPropertyNames(value)
    let acceptedAttributeSet = new Set(acceptedAttributes)
    for (let name of objectAttributes) {
        if (!acceptedAttributeSet.has(name)) {
            return `${name}: not accepted attribute name`
        }
    }
    return undefined
}

/**
 * @template T
 * @param {T} value
 * @param {Function | string} type
 * @return {undefined | string}
 * @example
 * validateInstance(null, 'any')
 * validateInstance('foo', 'string')
 * validateInstance(true, 'boolean')
 * validateInstance(1, 'number')
 * validateInstance([1, 2], Array)
 */
function validateInstance(value, type) {
    if (type === 'any') {
        return undefined
    }
    else if (typeof(type) === 'string') {
        return typeof(value) === type
            ? undefined
            : `expect type ${type}`
    }
    else {
        return (value instanceof type)
            ? undefined
            : `expect type ${type.name}`
    }
}

/**
 * @template T
 * @param {Array<T>} value
 * @param {Function | string} type
 * @param {number | undefined} minSize
 * @param {number | undefined} maxSize
 * @return {undefined | string}
 * @example
 * // Validate list of numbers.
 * let n = [1, 2, 3]
 * validateArray(n, 'number').open()
 *
 * // Validate list of buffers.
 * let b = [
 *     Buffer.from([1]),
 *     Buffer.from([2])
 * ]
 * validateArray(b, Buffer).open()
 */
function validateArray(
    value, type, minSize = undefined, maxSize = undefined
) {
    if (!Array.isArray(value)) {
        return 'expect type Array'
    }
    if ((minSize !== undefined) && (value.length < minSize)) {
        return `expect ${minSize} items at least`
    }
    if ((maxSize !== undefined) && (value.length > maxSize)) {
        return `expect ${maxSize} items at most`
    }
    for (let i = 0; i < value.length; ++i) {
        let e1 = validateInstance(value[i], type)
        if (e1) {
            return `[${i}]: ${e1}`
        }
    }
    return undefined
}

/**
 *
 * @param {any} value
 * @param {number} min
 * @param {number} max
 * @return {undefined | string}
 */
function validateInteger(value, min = undefined, max = undefined) {
    if (
        (Number.isSafeInteger(value) === false) ||
        (min !== undefined && value < min) ||
        (max !== undefined && value > max)
    ) {
        return 'expect type number, integer in range'
    }
    return undefined
}

/**
 * @param {any} value
 * @param {number} min
 * @param {number} max
 * @return {Function}
 */
function validateFloat(value, min = undefined, max = undefined) {
    if (
        Number.isNaN(value) ||
        (min !== undefined && value < min) ||
        (max !== undefined && value > max)
    ) {
        return 'expect type number in range'
    }
    return undefined
}

module.exports = {
    validateObject,
    validateInstance,
    validateInstanceMap,
    validateArray,
    validateInteger,
    validateFloat
}
