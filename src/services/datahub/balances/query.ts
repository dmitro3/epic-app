import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetBalanceQuery,
  GetBalanceQueryVariables,
  GetIsActiveStakerQuery,
  GetIsActiveStakerQueryVariables,
  GetIsBalanceSufficientQuery,
  GetIsBalanceSufficientQueryVariables,
  SocialAction,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_IS_BALANCE_SUFFICIENT = gql`
  query GetIsBalanceSufficient(
    $address: String!
    $socialAction: SocialAction!
  ) {
    isBalanceSufficientForSocialAction(
      args: { address: $address, socialAction: $socialAction }
    ) {
      sufficient
    }
  }
`
export async function getIsBalanceSufficient(args: {
  address: string
  socialAction: SocialAction
}): Promise<boolean> {
  const res = await datahubQueryRequest<
    GetIsBalanceSufficientQuery,
    GetIsBalanceSufficientQueryVariables
  >({
    document: GET_IS_BALANCE_SUFFICIENT,
    variables: args,
  })

  return res.isBalanceSufficientForSocialAction.sufficient
}
export const getIsBalanceSufficientQuery = createQuery({
  key: 'getIsBalanceSufficient',
  fetcher: getIsBalanceSufficient,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_BALANCE = gql`
  query GetBalance($address: String!) {
    socialProfileBalances(args: { where: { address: $address } }) {
      activeStakingPoints
    }
  }
`
async function getBalance(address: string): Promise<number> {
  const res = await datahubQueryRequest<
    GetBalanceQuery,
    GetBalanceQueryVariables
  >({
    document: GET_BALANCE,
    variables: { address },
  })

  return Number(res.socialProfileBalances?.activeStakingPoints) ?? 0
}
export const getBalanceQuery = createQuery({
  key: 'getBalance',
  fetcher: getBalance,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_IS_ACTIVE_STAKER = gql`
  query GetIsActiveStaker($address: String!) {
    activeStakingIsActiveStaker(address: $address)
  }
`
export async function getIsActiveStaker(address: string): Promise<boolean> {
  const res = await datahubQueryRequest<
    GetIsActiveStakerQuery,
    GetIsActiveStakerQueryVariables
  >({
    document: GET_IS_ACTIVE_STAKER,
    variables: { address },
  })

  return res.activeStakingIsActiveStaker
}
export const getIsActiveStakerQuery = createQuery({
  key: 'getIsActiveStaker',
  fetcher: getIsActiveStaker,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
