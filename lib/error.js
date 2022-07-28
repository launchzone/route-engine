'use strict'

class HttpEndpointError extends Error {
    /**
     *
     * @param {number} status
     * @param {string} body
     */
    constructor(status, body) {
        super(`status=${status}; body=${body}`)
        this.name = 'HttpEndpointError'
    }

    /**
     *
     * @param {object} res
     * @return {HttpEndpointError}
     * @throws {Error}
     */
    static fromAxiosResponse(res) {
        let {status, data} = res
        if (status >= 200 && status < 300) {
            throw new Error('expect non 2xx status')
        }
        return new HttpEndpointError(status, data)
    }
}

class BscEndpointError extends Error {
    constructor(message) {
        super(message)
        this.name = 'BscEndpointError'
    }
}

module.exports = {
    HttpEndpointError,
    BscEndpointError
}
