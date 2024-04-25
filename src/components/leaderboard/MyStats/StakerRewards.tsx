import FormatBalance from '@/components/FormatBalance'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getRewardHistoryQuery } from '@/services/datahub/content-staking/query'
import { BN } from '@polkadot/util'
import { convertToBalanceWithDecimal, isEmptyArray } from '@subsocial/utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLeaderboardContext } from '../LeaderboardContext'

type StakerRewardsProps = {
  address: string
}

const StakerRewards = ({ address }: StakerRewardsProps) => {
  const { data, isLoading } = getRewardHistoryQuery.useQuery(address)
  const { leaderboardRole } = useLeaderboardContext()

  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const rewards = useMemo(() => {
    return (
      data?.rewards.filter((reward) => {
        const usedReward =
          leaderboardRole === 'staker' ? reward.reward : reward.creatorReward
        return BigInt(usedReward) > 0
      }) ?? []
    )
  }, [data, leaderboardRole])

  const sectionTitle = leaderboardRole === 'staker' ? 'Staker' : 'Creator'

  return (
    <div className='flex flex-col gap-5 rounded-2xl bg-slate-800 p-4'>
      <div className='flex flex-col gap-2'>
        <span className='text-lg font-bold leading-normal'>
          {sectionTitle} Rewards
        </span>
        <span className='text-sm font-normal leading-[22px] text-text-muted'>
          The last 30 days of my Content Staking rewards
        </span>
      </div>
      {rewards && !isEmptyArray(rewards) ? (
        <div className='flex flex-col gap-5'>
          {rewards.map((reward) => {
            const userRewardValue =
              leaderboardRole === 'staker'
                ? reward.reward
                : reward.creatorReward

            const rewardValueWithDecumal =
              userRewardValue && decimal
                ? convertToBalanceWithDecimal(userRewardValue, decimal)
                : new BigNumber(0)

            return (
              <RewardsRow
                key={reward.week}
                date={
                  <span className='ColorMuted FontSmall'>
                    {formatDate(reward.startDate, 'DD.MM.YY')} -{' '}
                    {formatDate(reward.endDate, 'DD.MM.YY')}
                  </span>
                }
                rewardValue={
                  <FormatBalance
                    value={rewardValueWithDecumal.toString()}
                    symbol={tokenSymbol}
                    defaultMaximumFractionDigits={2}
                    loading={isLoading}
                  />
                }
              />
            )
          })}
        </div>
      ) : (
        <span className='text-text-muted'>No rewards yet</span>
      )}
    </div>
  )
}

export const formatDate = (date: dayjs.ConfigType | BN, format = 'lll') => {
  date = BN.isBN(date) ? date.toNumber() : date
  return dayjs(date).format(format)
}

type RewardsRowProps = {
  date: React.ReactNode
  rewardValue: React.ReactNode
}

const RewardsRow = ({ date, rewardValue }: RewardsRowProps) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <span className='text-sm leading-[22px] text-text-muted'>{date}</span>
      <span className='text-base font-semibold'>{rewardValue}</span>
    </div>
  )
}

export default StakerRewards
