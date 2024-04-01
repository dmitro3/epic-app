import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import MdRenderer from '@/components/MdRenderer'
import ProfilePreview from '@/components/ProfilePreview'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import { ProposalDetail } from '@/pages/api/opengov/proposals/[id]'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import ProposalDetailModal from './ProposalDetailModal'

export default function ProposalDetailSection({
  proposal,
  className,
}: {
  proposal: ProposalDetail
  className?: string
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <div className={cx('container-page flex flex-col gap-4', className)}>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span>{formatBalanceWithDecimals(proposal.requested)} DOT</span>
          <span className='text-text-muted'>≈$3,567.34</span>
        </div>
        <ProfilePreview
          withPolkadotIdentity
          address={proposal.proposer}
          showAddress={false}
          className='gap-1'
          nameClassName='text-sm text-text-muted'
          avatarClassName='h-5 w-5'
        />
      </div>
      <Card className='flex flex-col items-start gap-6 bg-background-light'>
        <h1 className='font-bold'>
          #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
          {proposal.title}
        </h1>
        <MdRenderer className='line-clamp-6' source={proposal.content} />
        <LinkText
          variant='secondary'
          href={`/opengov/${proposal.id}#detail`}
          shallow
          onClick={() => setIsOpenModal(true)}
        >
          Read more
        </LinkText>
      </Card>
      <Card className='flex flex-col gap-4 bg-background-light'>
        <div className='flex items-center justify-between gap-4'>
          <span className='font-medium'>Status</span>
          <ProposalStatus withBg className='text-sm' proposal={proposal} />
        </div>
        <div className='flex items-center gap-6'>
          <VoteSummary cutout={34} className='h-20 w-20' proposal={proposal} />
          <div className='flex w-full flex-col'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-1'>
                <FaCheck className='text-[#5EC269]' />
                <span className='text-sm'>
                  Aye <span className='text-text-muted'>(125)</span>
                </span>
              </div>
              <span>{formatBalanceWithDecimals(proposal.vote.ayes)} DOT</span>
            </div>
            <div className='my-3 h-px w-full bg-border-gray/40 dark:bg-background-lightest/30' />
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-1'>
                <FaX className='text-text-red' />
                <span className='text-sm'>
                  Nay <span className='text-text-muted'>(125)</span>
                </span>
              </div>
              <span>{formatBalanceWithDecimals(proposal.vote.ayes)} DOT</span>
            </div>
          </div>
        </div>
      </Card>
      <ProposalDetailModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        proposal={proposal}
      />
    </div>
  )
}
