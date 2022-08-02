import { BigNumber, ethers } from 'ethers'

export const bufferToPrefixedHex = (buffer: Buffer) => {
  const hex = buffer.toString('hex')
  return `0x${hex}`
}

export const bufferToAddress = (buffer: Buffer) => {
  const hex = ethers.utils.getAddress(buffer.toString('hex'))
  return hex
}

export const bufferToDecimal = (buffer: Buffer) => {
  const hex = bufferToPrefixedHex(buffer)
  return BigNumber.from(hex).toString()
}

export const hexToBuffer = (hex: string) => Buffer.from(hex.replace(/^0x/, ''), 'hex')
export const decimalToBuffer = (decimal: number | string) =>
  Buffer.from(BigNumber.from(decimal).toHexString().slice(2), 'hex')
