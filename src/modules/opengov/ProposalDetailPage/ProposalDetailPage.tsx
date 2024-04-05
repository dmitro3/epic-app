import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import { env } from '@/env.mjs'
import useToastError from '@/hooks/useToastError'
import BottomPanel from '@/modules/chat/ChatPage/BottomPanel'
import { Proposal } from '@/server/opengov/mapper'
import { useCreateDiscussion } from '@/services/api/mutation'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { Resource } from '@subsocial/resource-discussions'
import { ReactNode, useEffect, useState } from 'react'
import { HiChevronUp } from 'react-icons/hi2'
import ProposalDetailModal from './ProposalDetailModal'
import ProposalDetailSection from './ProposalDetailSection'

export type ProposalDetailPageProps = {
  proposal: Proposal
  chatId: string | null
}

export function getProposalResourceId(proposalId: number | string) {
  return new Resource({
    chainName: 'polkadot',
    chainType: 'substrate',
    resourceType: 'proposal',
    resourceValue: {
      id: proposalId.toString(),
    },
    schema: 'chain',
  }).toResourceId()
}

export default function ProposalDetailPage({
  proposal,
  chatId,
}: ProposalDetailPageProps) {
  const [isOpenComment, setIsOpenComment] = useState(false)
  const { mutateAsync, error, isLoading } = useCreateDiscussion()
  useToastError(error, 'Failed to create discussion')

  useEffect(() => {
    if (getUrlQuery('chat') === 'true') {
      setIsOpenComment(true)
      replaceUrl(getCurrentUrlWithoutQuery('chat'))
    }
  }, [])

  const [usedChatId, setUsedChatId] = useState(chatId)

  const createDiscussion = async function () {
    const { data } = await mutateAsync({
      spaceId: env.NEXT_PUBLIC_PROPOSALS_HUB,
      content: {
        title: proposal.title,
      },
      resourceId: getProposalResourceId(proposal.id),
    })
    if (data?.postId) {
      setUsedChatId(data.postId)
    }
  }

  return (
    <DefaultLayout
      withFixedHeight
      navbarProps={{
        withLargerContainer: true,
        backButtonProps: {
          defaultBackLink: '/opengov',
          forceUseDefaultBackLink: false,
        },
        customContent: ({ backButton, authComponent, notificationBell }) => (
          <div className='flex w-full items-center justify-between gap-4 overflow-hidden'>
            <NavbarChatInfo backButton={backButton} proposal={proposal} />
            <div className='flex items-center gap-3'>
              {notificationBell}
              {authComponent}
            </div>
          </div>
        ),
      }}
    >
      <div className='relative flex flex-1 flex-col overflow-hidden'>
        <div
          className={cx(
            'absolute left-0 z-20 w-full bg-background transition lg:w-auto [@media(min-width:1300px)]:left-[calc((100%_-_1300px)_/_2)]',
            isOpenComment && 'pointer-events-none -translate-y-1/4 opacity-0'
          )}
        >
          <div className='h-[calc(100dvh_-_3.5rem)] overflow-auto px-4 pb-24 pt-4 scrollbar-none lg:pb-8 lg:pr-0'>
            <ProposalDetailSection
              proposal={proposal}
              className='lg:w-[400px]'
            />
          </div>
          <div className='container-page absolute bottom-0 h-20 w-full border-t border-border-gray bg-background-light py-4 lg:hidden'>
            <Button
              size='lg'
              className='w-full'
              onClick={() => setIsOpenComment(true)}
            >
              Comment (6)
            </Button>
          </div>
        </div>
        <div className='w-full border-b border-border-gray bg-background-light lg:hidden'>
          <Button
            size='noPadding'
            variant='transparent'
            className='flex h-10 w-full items-center justify-center gap-2 text-sm text-text-muted'
            interactive='none'
            onClick={() => setIsOpenComment(false)}
          >
            <span>Back to proposal</span>
            <HiChevronUp />
          </Button>
        </div>
        <ChatRoom
          chatId={usedChatId ?? ''}
          hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
          asContainer
          withDesktopLeftOffset={416}
          customAction={
            !usedChatId ? (
              <Button
                size='lg'
                onClick={createDiscussion}
                isLoading={isLoading}
              >
                Start Discussion
              </Button>
            ) : undefined
          }
        />
        <BottomPanel withDesktopLeftOffset={416} />
      </div>
    </DefaultLayout>
  )
}

function NavbarChatInfo({
  proposal,
  backButton,
}: {
  proposal: Proposal
  backButton: ReactNode
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <div className='flex flex-1 items-center overflow-hidden'>
      {backButton}
      <Button
        variant='transparent'
        interactive='none'
        size='noPadding'
        className={cx(
          'flex flex-1 cursor-pointer items-center gap-2 overflow-hidden rounded-none text-left'
        )}
        onClick={() => {
          setIsOpenModal(true)
        }}
      >
        <VoteSummary proposal={proposal} className='h-10 w-10' type='small' />
        <div className='flex flex-col overflow-hidden'>
          <div className='flex items-center gap-2 overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {proposal.title}
            </span>
          </div>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-text-muted'>
            {formatBalanceWithDecimals(proposal.requested)} DOT &middot;{' '}
            <ProposalStatus proposal={proposal} />
          </span>
        </div>
      </Button>
      <ProposalDetailModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        proposal={proposal}
      />
    </div>
  )
}
