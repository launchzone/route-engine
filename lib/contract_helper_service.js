'use strict'

const {JsonRpcProvider} = require('@ethersproject/providers')
const {Contract} = require('ethers')
const {BscEndpointError} = require('./error')
const {validateInstanceMap, validateArray} = require('./validator')
const {HttpEndpoint} = require('./http_endpoint')
const {Address} = require('./address')
const {ContractHelperPoolMap} = require('./contract_helper_result')
const CONTRACT_HELPER_CODE = require('./contract_helper_code.json')

/**
 * @private
 */
class ContractHelperService {
    /**
     *
     * @param {object} services
     * @param {Contract} services.contract
     */
    constructor(services) {
        this._contract = services.contract
    }

    /**
     *
     * @param {object} options
     * @param {HttpEndpoint} options.endpoint
     * @param {Address} options.address
     * @return {ContractHelperService}
     * @throws {TypeError}
     */
    static create(options) {
        let e1 = validateInstanceMap(options, [
            ['endpoint', HttpEndpoint],
            ['address', Address]
        ])
        if (e1) {
            throw new TypeError(e1)
        }
        let provider = _createEthersProvider(options.endpoint, options.address)
        let contract = new Contract(
            options.address.toHeximal(), CONTRACT_HELPER_CODE.abi, provider
        )
        return new ContractHelperService({contract})
    }

    /**
     * Retrive reserves of pools by it's addresses.
     *
     * @param {Array<Address>} addresses
     * @return {Promise<ContractHelperPoolMap>}
     * @throws {TypeError | BscEndpointError}
     */
    async getPools(addresses) {
        let e1 = validateArray(addresses, Address)
        if (e1) {
            throw new TypeError(`addresses: ${e1}`)
        }
        let heximalAddresses = addresses.map(a => a.toHeximal())
        let response
        try {
            response = await this._contract.functions.getReserves(
                heximalAddresses
            )
        }
        catch (error) {
            throw new BscEndpointError(error.message)
        }
        let [reserves] = response
        return ContractHelperPoolMap.fromApiResponse(reserves, addresses)
    }
}

/**
 *
 * @param {HttpEndpoint} endpoint
 * @param {Address} contractHelperAdress
 * @return {JsonRpcProvider}
 */
function _createEthersProvider(endpoint, contractHelperAdress) {
    let provider = new JsonRpcProvider(endpoint.value.toString())
    let heximalAddress = contractHelperAdress.toHeximal()
    provider.setStateOverride({
        [heximalAddress]: {
            code: CONTRACT_HELPER_CODE.deployedBytecode
        }
    })
    return provider
}

module.exports = {
    ContractHelperService,
    ContractHelperPoolMap
}
