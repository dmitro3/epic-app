import Loading from '@/components/Loading'
import Tabs from '@/components/Tabs'
import { leaderboardDataQueryByPeriod } from '@/services/datahub/leaderboard/query'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import {
  Data,
  LeaderboardNoData,
  UserReward,
} from '../StatsPage/LeaderboardTable'
import LeaderboardByPointsModal from './LeaderboardByPointsModal'
import LeaderboardPreviewItem from './LeaderboardPreveiwItem'

const LeaderboardByPoints = () => {
  const tabs = [
    {
      id: 'week',
      text: 'This week',
      content: () => <LeaderboardPreviewByPeriod period='week' />,
    },
    {
      id: 'allTime',
      text: 'All-Time',
      content: () => <LeaderboardPreviewByPeriod period='allTime' />,
    },
  ]

  return (
    <div className='flex flex-col gap-4 overflow-hidden rounded-2xl bg-slate-800 p-4 pb-0'>
      <span className='text-lg font-semibold'>💎 Users by Points</span>
      <div className='flex h-full w-full flex-col gap-4'>
        <Tabs
          className='rounded-full bg-slate-900 p-[2px]'
          panelClassName='mt-0 w-full h-full max-w-full px-0 z-0'
          containerClassName='h-full'
          tabClassName={(selected) =>
            cx(
              {
                ['bg-background-primary/50 rounded-full [&>span]:!text-text']:
                  selected,
              },
              '[&>span]:text-slate-300 leading-6 font-medium p-[6px] [&>span]:text-sm border-none'
            )
          }
          asContainer
          tabStyle='buttons'
          defaultTab={0}
          tabs={tabs}
        />
      </div>
    </div>
  )
}

type LeaderboardPreviewByPeriodProps = {
  period: 'week' | 'allTime'
}

const LeaderboardPreviewByPeriod = ({
  period,
}: LeaderboardPreviewByPeriodProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { data: leaderboardDataResult, isLoading } =
    leaderboardDataQueryByPeriod[period].useQuery(period)

  const { leaderboardData, totalCount } = leaderboardDataResult || {}

  const leaderboardDataSlice = leaderboardData?.slice(0, 3)

  return (
    <>
      <div className='mt-4 flex flex-col gap-2'>
        {leaderboardDataSlice?.length === 0 &&
          (isLoading ? (
            <Loading title='Loading table data' className='p-7' />
          ) : (
            <LeaderboardNoData />
          ))}
        {leaderboardDataSlice?.map((item: Data, i: number) => {
          const { address, reward } = item

          return (
            <LeaderboardPreviewItem
              key={i}
              address={address}
              showDivider={i !== leaderboardDataSlice.length - 1}
              value={
                <div className='flex flex-col items-end gap-2'>
                  <span className='text-xs leading-none text-slate-400'>
                    Points:
                  </span>
                  <UserReward reward={reward} />
                </div>
              }
            />
          )
        })}
        {leaderboardDataSlice?.length > 0 && (
          <div>
            <div className='-mx-[40px] border-t border-slate-700'></div>
            <div
              onClick={() => setIsOpen(true)}
              className='flex cursor-pointer items-center justify-center  p-4 leading-none text-text-primary'
            >
              See all participants
            </div>
          </div>
        )}
      </div>
      <LeaderboardByPointsModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default LeaderboardByPoints
