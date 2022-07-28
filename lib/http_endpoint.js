'use strict'

/**
 * @private
 */
class HttpEndpoint {
    /**
     * @type {URL}
     */
    get value() {
        return this._value
    }

    /**
     *
     * @param {URL} value
     */
    constructor(value) {
        this._value = value
    }

    /**
     *
     * @param {string} value
     * @return {HttpEndpoint}
     * @throws {TypeError}
     */
    static fromString(value) {
        let url
        try {
            url = new URL(value)
        }
        catch (error) {
            throw new TypeError('expect type string as HTTP URL')
        }
        if (['http:', 'https:'].includes(url.protocol) === false) {
            throw new TypeError('expect type string as HTTP URL')
        }
        return new HttpEndpoint(url)
    }
}

module.exports = {
    HttpEndpoint
}
