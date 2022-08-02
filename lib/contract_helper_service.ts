import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract, ethers } from 'ethers'
import { createContractHelperPoolMap } from './contract_helper_result'
import CONTRACT_HELPER_CODE from './contract_helper_code.json'

export const getPools =
  ({ endpoint, address }: { endpoint: string; address: string }) =>
    async (addresses: string[]) => {
    const provider = new JsonRpcProvider(endpoint)
    const heximalAddress = ethers.utils.getAddress(address)
    provider.setStateOverride({
      [heximalAddress]: {
        code: CONTRACT_HELPER_CODE.deployedBytecode,
      } as any,
    })
    const contract = new Contract(
      ethers.utils.getAddress(address),
      CONTRACT_HELPER_CODE.abi,
      provider,
    )
    const response = await contract.functions.getReserves(addresses)
    const [reserves] = response
    return createContractHelperPoolMap({ reserves, addresses })
  }
