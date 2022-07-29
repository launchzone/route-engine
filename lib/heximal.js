'use strict'

/**
 * Note: This is not actual type, MUST NOT create instances from this type.
 * It just includes data specification and validations.
 *
 * Heximal string, prefix with `0x`.
 */
class Heximal {
    /**
     *
     * @param {any} value
     * @return {undefined | string}
     */
    static validate(value) {
        let format = /^0x[a-fA-F0-9]{1,}$/
        return (format.test(value) === true)
            ? undefined
            : 'expect type Heximal'
    }
}

module.exports = {
    Heximal
}
