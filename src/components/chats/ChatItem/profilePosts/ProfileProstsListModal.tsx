import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import Name from '@/components/Name'
import SkeletonFallback from '@/components/SkeletonFallback'
import { env } from '@/env.mjs'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import { getModerationReasonsQuery } from '@/services/datahub/moderation/query'
import { getPaginatedPostIdsByPostIdAndAccount } from '@/services/datahub/posts/queryByAccount'
import { useSendEvent } from '@/stores/analytics'
import { useProfilePostsModal } from '@/stores/profile-posts-modal'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { Transition } from '@headlessui/react'
import { useMiniAppRaw } from '@tma.js/sdk-react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  HiOutlineChevronLeft,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'
import { useModerateWithSuccessToast } from '../ChatItemMenus'
import ProfileDetailModal from './ProfileDetailModal'
import ProfilePostsList from './ProfilePostsList'

type Tab = 'all' | 'contest'

type ProfilePostsListModalProps = {
  tabsConfig?: {
    defaultTab: Tab
  }
}

const defaultHubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatIdByTab = {
  all: env.NEXT_PUBLIC_MAIN_CHAT_ID,
  contest: env.NEXT_PUBLIC_CONTEST_CHAT_ID,
}

export default function ProfilePostsListModal({
  tabsConfig,
}: ProfilePostsListModalProps) {
  const [isOpenDetail, setIsOpenDetail] = useState(false)
  const [selectedTab, setSelectedTab] = useState<Tab>(
    tabsConfig?.defaultTab || 'all'
  )

  const router = useRouter()

  const defaultChatId = tabsConfig ? chatIdByTab[tabsConfig.defaultTab] : ''

  const {
    isOpen,
    closeModal,
    messageId = '',
    chatId = !defaultChatId ? chatIdByTab['all'] : '',
    hubId = defaultHubId,
    address = '',
    openModal,
  } = useProfilePostsModal()

  const { mutate: moderate } = useModerateWithSuccessToast(messageId, chatId)
  const sendEvent = useSendEvent()
  const isAdmin = useIsModerationAdmin()
  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const app = useMiniAppRaw(true)

  const isDesktop = !isTouchDevice() && !app?.result

  const { data, isLoading } =
    getPaginatedPostIdsByPostIdAndAccount.useInfiniteQuery(chatId, address)
  const totalPostsCount = data?.pages[0].totalData || 0

  const { data: reasons } = getModerationReasonsQuery.useQuery(null)
  const firstReasonId = reasons?.[0].id

  const onBlockUserClick = () => {
    sendEvent('block_user', { hubId, chatId })
    moderate({
      callName: 'synth_moderation_block_resource',
      args: {
        reasonId: firstReasonId,
        resourceId: address,
        ctxPostIds: ['*'],
        ctxAppIds: ['*'],
      },
      chatId,
    })

    closeModal()
  }

  useEffect(() => {
    closeModal()
  }, [closeModal, router.asPath])

  return createPortal(
    <>
      <Transition
        appear
        as={'div'}
        show={isOpen}
        className='fixed inset-0 z-10 h-full w-full bg-background transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
      />
      <Transition
        appear
        as={'div'}
        show={isOpen}
        className={cx(
          'fixed inset-0 z-10 flex h-full w-full flex-col bg-background  transition duration-300',
          { ['pb-20']: !isDesktop }
        )}
        enterFrom={cx('opacity-0 -translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 -translate-y-24 !duration-150'
      >
        <ProfileDetailModal
          isOpen={isOpenDetail}
          closeModal={() => setIsOpenDetail(false)}
          address={address}
        />
        <div
          className={cx(
            'mx-auto flex w-full flex-1 flex-col overflow-auto',
            isDesktop ? 'max-w-screen-xl' : 'max-w-screen-md'
          )}
        >
          <div className='relative mx-auto flex w-full items-center justify-between gap-2 py-3 pl-1 pr-2'>
            <div className='flex flex-1 items-center gap-2'>
              <Button
                variant='transparent'
                size='circle'
                className='min-w-[auto]'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  closeModal()
                }}
              >
                <HiOutlineChevronLeft />
              </Button>
              <AddressAvatar
                address={address}
                className='-ml-1 flex-shrink-0 cursor-pointer'
              />
              <div
                className='flex flex-col gap-0.5'
                onClick={() => {
                  if (isAdmin) setIsOpenDetail(true)
                }}
              >
                <Name address={address} className='!text-text' clipText />
                <span className='flex items-center gap-1 text-xs font-medium leading-[normal] text-slate-400'>
                  <span>Memes:</span>
                  <SkeletonFallback
                    isLoading={isLoading}
                    className='my-0 w-fit min-w-8'
                  >
                    {totalPostsCount}
                  </SkeletonFallback>
                </span>
                {/* )} */}
              </div>
            </div>

            {isAuthorized && (
              <div className='flex items-center gap-2'>
                <Button
                  size='circleSm'
                  variant='transparent'
                  onClick={() => setIsOpenDetail(true)}
                >
                  <HiOutlineInformationCircle className='text-lg text-text-muted' />
                </Button>
                <Button
                  size='md'
                  variant='redOutline'
                  className='w-fit px-3 text-red-400'
                  onClick={onBlockUserClick}
                >
                  Block user
                </Button>
              </div>
            )}
          </div>
          <div className='relative mx-auto flex h-full max-h-full min-h-[400px] w-full flex-col items-center'>
            {tabsConfig && (
              <div className='sticky top-14 mb-2 grid h-12 w-full grid-flow-col items-center gap-4 bg-background px-4'>
                <TabButton
                  tab='all'
                  selectedTab={selectedTab}
                  setSelectedTab={(tab) => {
                    setSelectedTab(tab as any)
                    openModal({
                      address,
                      chatId: chatIdByTab[tab as Tab],
                      hubId: defaultHubId,
                    })
                  }}
                  size={'md'}
                >
                  All memes
                </TabButton>
                <TabButton
                  className='flex flex-col items-center justify-center text-center'
                  tab='contest'
                  selectedTab={selectedTab}
                  setSelectedTab={(tab) => {
                    setSelectedTab(tab as any)
                    openModal({
                      address,
                      chatId: chatIdByTab[tab as Tab],
                      hubId: defaultHubId,
                    })
                  }}
                  size={'md'}
                >
                  Contest
                </TabButton>
              </div>
            )}
            <ProfilePostsList address={address} chatId={chatId} hubId={hubId} />
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}

export const tabStates = [
  'all',
  'contest',
  'not-approved',
  'not-approved-contest',
] as const

export type TabState = (typeof tabStates)[number]
export function TabButton({
  selectedTab,
  setSelectedTab,
  tab,
  children,
  className,
  size = 'md',
  highlightSelected,
}: {
  tab: TabState
  selectedTab: TabState
  setSelectedTab: (tab: TabState) => void
  children: ReactNode
  className?: string
  size?: 'md' | 'sm'
  highlightSelected?: boolean
}) {
  const isSelected = selectedTab === tab
  return (
    <Button
      variant={isSelected ? 'primary' : 'transparent'}
      className={cx(
        'h-10 py-0 text-sm',
        size === 'sm' ? 'px-2' : 'h-10',
        isSelected
          ? highlightSelected
            ? 'bg-orange-500/80'
            : 'bg-background-primary/30'
          : '',
        className
      )}
      onClick={() => setSelectedTab(tab)}
    >
      {children}
    </Button>
  )
}
