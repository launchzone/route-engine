import { ethers } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { Exchange } from './exchange'
import { hexToBuffer, bufferToDecimal, bufferToPrefixedHex, decimalToBuffer } from './formatter'

const HEX_FF = Buffer.from('ff', 'hex')
const PANCAKESWAP_FACTORY_ADDRESS_V1 = hexToBuffer('0xbcfccbde45ce874adcb698cc183debcf17952812')
const PANCAKESWAP_FACTORY_CODE_V1 = hexToBuffer(
  '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66',
)
const PANCAKESWAP_FACTORY_ADDRESS_V2 = hexToBuffer('0xca143ce32fe78f1f7019d7d551a6402fc5350c73')
const PANCAKESWAP_FACTORY_CODE_V2 = hexToBuffer(
  '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
)
const BURGERSWAP_FACTORY_ADDRESS = hexToBuffer('0x8a1e9d3aebbbd5ba2a64d3355a48dd5e9b511256')
const BURGERSWAP_FACTORY_CODE = hexToBuffer(
  '0x9e2f28ebeccb25f4ead99c3f563bb6a201e2014a501d90dd0a9382bb1f5f4d0e',
)
const JULSWAP_FACTORY_ADDRESS = hexToBuffer('0x553990f2cba90272390f62c5bdb1681ffc899675')
const JULSWAP_FACTORY_CODE = hexToBuffer(
  '0xb1e98e21a5335633815a8cfb3b580071c2e4561c50afd57a8746def9ed890b18',
)
const APESWAP_FACTORY_ADDRESS = hexToBuffer('0x0841bd0b734e4f5853f0dd8d7ea041c241fb0da6')
const APESWAP_FACTORY_CODE = hexToBuffer(
  '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b',
)
const BAKERYSWAP_FACTORY_ADDRESS = hexToBuffer('0x01bf7c66c6bd861915cdaae475042d3c4bae16a7')
const BAKERYSWAP_FACTORY_CODE = hexToBuffer(
  '0xe2e87433120e32c4738a7d8f3271f3d872cbe16241d67537139158d90bac61d3',
)
const BI_FACTORY_ADDRESS = hexToBuffer('0x858e3312ed3a876947ea49d572a7c42de08af7ee')
const BI_FACTORY_INIT_CODE = hexToBuffer(
  '0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf',
)
const MDEX_FACTORY_ADDRESS = hexToBuffer('0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8')
const MDEX_FACTORY_INIT_CODE = hexToBuffer(
  '0x0d994d996174b05cfc7bed897dc1b20b4c458fc8d64fe98bc78b3c64a6b4d093',
)
const CAFE_FACTORY_ADDRESS = hexToBuffer('0x3e708fdbe3ada63fc94f8f61811196f1302137ad')
const CAFE_FACTORY_INIT_CODE = hexToBuffer(
  '0x90bcdb5d0bf0e8db3852b0b7d7e05cc8f7c6eb6d511213c5ba02d1d1dbeda8d3',
)
const JET_FACTORY_ADDRESS = hexToBuffer('0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5')
const JET_FACTORY_INIT_CODE = hexToBuffer(
  '0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651',
)
const BABY_FACTORY_ADDRESS = hexToBuffer('0x86407bea2078ea5f5eb5a52b2caa963bc1f889da')
const BABY_FACTORY_INIT_CODE = hexToBuffer(
  '0x48c8bec5512d397a5d512fbb7d83d515e7b6d91e9838730bd1aa1b16575da7f5',
)
const OPENOCEAN_FACTORY_ADDRESS = hexToBuffer('0xd76d8c2a7ca0a1609aea0b9b5017b3f7782891bf')
const OPENOCEAN_FACTORY_INIT_CODE = hexToBuffer(
  '0xe7da666f616ba3bdb18c6908b22d556a41659bdd652762c246b8d1fa4f7506b4',
)

export const EXCHANGE_ADDRESS_MAP = {
  [Exchange.PANCAKE]: {
    factoryAddress: PANCAKESWAP_FACTORY_ADDRESS_V1,
    code: PANCAKESWAP_FACTORY_CODE_V1,
  },
  [Exchange.PANCAKE2]: {
    factoryAddress: PANCAKESWAP_FACTORY_ADDRESS_V2,
    code: PANCAKESWAP_FACTORY_CODE_V2,
  },
  [Exchange.BAKERY]: {
    factoryAddress: BAKERYSWAP_FACTORY_ADDRESS,
    code: BAKERYSWAP_FACTORY_CODE,
  },
  [Exchange.JUL]: {
    factoryAddress: JULSWAP_FACTORY_ADDRESS,
    code: JULSWAP_FACTORY_CODE,
  },
  [Exchange.APE]: {
    factoryAddress: APESWAP_FACTORY_ADDRESS,
    code: APESWAP_FACTORY_CODE,
  },
  [Exchange.BI]: {
    factoryAddress: BI_FACTORY_ADDRESS,
    code: BI_FACTORY_INIT_CODE,
  },
  [Exchange.MDEX]: {
    factoryAddress: MDEX_FACTORY_ADDRESS,
    code: MDEX_FACTORY_INIT_CODE,
  },
  [Exchange.CAFE]: {
    factoryAddress: CAFE_FACTORY_ADDRESS,
    code: CAFE_FACTORY_INIT_CODE,
  },
  [Exchange.JET]: {
    factoryAddress: JET_FACTORY_ADDRESS,
    code: JET_FACTORY_INIT_CODE,
  },
  [Exchange.BABY]: {
    factoryAddress: BABY_FACTORY_ADDRESS,
    code: BABY_FACTORY_INIT_CODE,
  },
  [Exchange.OPENOCEAN]: {
    factoryAddress: OPENOCEAN_FACTORY_ADDRESS,
    code: OPENOCEAN_FACTORY_INIT_CODE,
  },
}

export function getPoolAddress(exchange: string, addressA: string, addressB: string) {
  switch (exchange) {
    case 'pancake':
      return _getPoolAddressPancake(addressA, addressB)
    case 'pancake2':
      return _getPoolAddressPancake2(addressA, addressB)
    case 'bakery':
      return _getPoolAddressBakery(addressA, addressB)
    case 'jul':
      return _getPoolAddressJul(addressA, addressB)
    case 'ape':
      return _getPoolAddressApe(addressA, addressB)
    case 'burger':
      return _getPoolAddressBurger(addressA, addressB)
    case 'bi':
      return _getPoolAddressBi(addressA, addressB)
    case 'mdex':
      return _getPoolAddressMdex(addressA, addressB)
    case 'cafe':
      return _getPoolAddressCafe(addressA, addressB)
    case 'jet':
      return _getPoolAddressJet(addressA, addressB)
    case 'baby':
      return _getPoolAddressBaby(addressA, addressB)
    case 'openocean':
      return _getPoolAddressOpenocean(addressA, addressB)
    default:
      throw Error('invalid exchange name')
  }
}

function _sortAddressPair(addressA: string, addressB: string) {
  return [addressA, addressB].sort((a, b) => (a < b ? -1 : 1))
}

/**
 * Retrieve hash of `data` by Keccak256 algorithm.
 *
 * @private
 * @param {Buffer} data
 * @returns {Buffer}
 */
function _keccak256AsBuffer(data: Buffer) {
  return Buffer.from(keccak256(data).substring(2), 'hex')
}


function _getPoolAddressPancake(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([
    HEX_FF,
    PANCAKESWAP_FACTORY_ADDRESS_V1,
    salt,
    PANCAKESWAP_FACTORY_CODE_V1,
  ])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on PancakeSwap V2.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressPancake2(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([
    HEX_FF,
    PANCAKESWAP_FACTORY_ADDRESS_V2,
    salt,
    PANCAKESWAP_FACTORY_CODE_V2,
  ])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on BakerySwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBakery(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, BAKERYSWAP_FACTORY_ADDRESS, salt, BAKERYSWAP_FACTORY_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on JulSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressJul(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, JULSWAP_FACTORY_ADDRESS, salt, JULSWAP_FACTORY_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on ApeSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressApe(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, APESWAP_FACTORY_ADDRESS, salt, APESWAP_FACTORY_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on BurgerSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBurger(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, BURGERSWAP_FACTORY_ADDRESS, salt, BURGERSWAP_FACTORY_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on BiSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressBi(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, BI_FACTORY_ADDRESS, salt, BI_FACTORY_INIT_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on MdexSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressMdex(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, MDEX_FACTORY_ADDRESS, salt, MDEX_FACTORY_INIT_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on CafeSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressCafe(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, CAFE_FACTORY_ADDRESS, salt, CAFE_FACTORY_INIT_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * Build pool address on JetSwap.
 *
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @returns {EthAddress}
 */
function _getPoolAddressJet(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, JET_FACTORY_ADDRESS, salt, JET_FACTORY_INIT_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

function _getPoolAddressBaby(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, BABY_FACTORY_ADDRESS, salt, BABY_FACTORY_INIT_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}

/**
 * @private
 * @param {EthAddress} addressA
 * @param {EthAddress} addressB
 * @return {EthAddress}
 */
function _getPoolAddressOpenocean(addressA: string, addressB: string) {
  let addresses = _sortAddressPair(addressA, addressB)
  let salt = _keccak256AsBuffer(Buffer.concat(addresses.map(hexToBuffer)))
  let data = Buffer.concat([HEX_FF, OPENOCEAN_FACTORY_ADDRESS, salt, OPENOCEAN_FACTORY_INIT_CODE])
  let hash = _keccak256AsBuffer(data)

  return hash.slice(12)
}
