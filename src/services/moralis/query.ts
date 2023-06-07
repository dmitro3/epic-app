import { createQuery } from '@/subsocial-query'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import { NftProperties } from '@subsocial/api/types'
import axios from 'axios'
import { getMoralisApi } from './utils'

async function getNftPrice(nft: NftProperties) {
  const apiUrl = `https://api.opensea.io/v2/orders/${nft.chain}/seaport/listings?asset_contract_address=${nft.collectionId}&limit=1&token_ids=${nft.nftId}&order_by=eth_price&order_direction=asc`
  const response = await axios.get(apiUrl, {
    headers: {
      'X-API-KEY': '207875fb75e042ee8b313d83aad47f34',
    },
  })

  const [order] = response.data?.orders ?? []
  const price = order?.current_price

  return price
}

async function getNftData(nft: NftProperties) {
  const moralis = await getMoralisApi()
  const [response, price] = await Promise.all([
    moralis?.EvmApi.nft.getNFTMetadata({
      address: nft.collectionId,
      tokenId: nft.nftId,
      chain: EvmChain.ETHEREUM,
      normalizeMetadata: true,
    }),
    getNftPrice(nft),
  ])
  const metadata = response?.raw.normalized_metadata

  return {
    name: metadata?.name,
    image: metadata?.image,
    collectionName: response?.raw.name,
    price,
  }
}

export const getNftDataQuery = createQuery({
  key: 'getNftData',
  fetcher: getNftData,
})
