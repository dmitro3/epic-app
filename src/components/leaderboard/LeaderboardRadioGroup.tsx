import { cx } from '@/utils/class-names'
import { RadioGroup } from '@headlessui/react'
import { useLeaderboardContext } from './LeaderboardContext'

export const LeaderboardRoleRadioGroup = () => {
  const { leaderboardRole, setLeaderboardRole } = useLeaderboardContext()
  const labels = ['Staker', 'Creator']

  return (
    <RadioGroup
      value={leaderboardRole}
      onChange={setLeaderboardRole}
      className='flex h-[34px] items-center gap-[2px] rounded-lg bg-white px-[2px] dark:bg-white/10'
    >
      {labels.map((label, i) => (
        <RadioGroup.Option
          key={i}
          value={label.toLowerCase()}
          className='leading-none'
        >
          {({ checked }) => (
            <span
              className={cx(
                'cursor-pointer rounded-md p-2 text-sm font-medium leading-[22px]',
                {
                  ['bg-background-primary text-white']: checked,
                }
              )}
            >
              {label}
            </span>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  )
}
export default LeaderboardRoleRadioGroup
