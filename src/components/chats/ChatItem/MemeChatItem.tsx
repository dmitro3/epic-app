import Thumbsup from '@/assets/emojis/thumbsup.png'
import AddressAvatar from '@/components/AddressAvatar'
import MediaLoader from '@/components/MediaLoader'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import SuperLike, {
  SuperLikeButton,
  SuperLikeButtonProps,
  SuperLikeWrapper,
} from '@/components/content-staking/SuperLike'
import { getPostExtensionProperties } from '@/components/extensions/utils'
import { FloatingWrapperProps } from '@/components/floating/FloatingWrapper'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import useLongTouch from '@/hooks/useLongTouch'
import { PostRewards } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { PostData } from '@subsocial/api/types'
import { useHapticFeedbackRaw } from '@tma.js/sdk-react'
import { ComponentProps, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { ScrollToMessage } from '../ChatList/hooks/useScrollToMessage'
import UnapprovedMemeCount from '../UnapprovedMemeCount'
import ApprovedUserChip from '../UnapprovedUserChip'
import ApproveMemeButton from './ApproveMemeButton'
import BlockUnblockMemeButton from './BlockUnblockMemeButton'
import ChatItemMenus from './ChatItemMenus'
import ChatRelativeTime from './ChatRelativeTime'

export type MemeChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  message: PostData
  messageBubbleId?: string
  scrollToMessage?: ScrollToMessage
  enableChatMenu?: boolean
  enableProfileModal?: boolean
  chatId: string
  hubId: string
  showApproveButton?: boolean
  showBlockButton?: boolean
  withWrapper?: boolean
  disableSuperLike?: boolean
  menuIdPrefix?: string
  dummySuperLike?: SuperLikeButtonProps
  noBorder?: boolean
}

export default function MemeChatItem({
  message,
  scrollToMessage,
  messageBubbleId,
  enableChatMenu = true,
  chatId,
  hubId,
  withWrapper,
  disableSuperLike,
  showApproveButton,
  showBlockButton,
  enableProfileModal = true,
  menuIdPrefix,
  dummySuperLike,
  noBorder,
  ...props
}: MemeChatItemProps) {
  const { ref, inView } = useInView()
  const { ownerId, id: messageId } = message.struct
  const { body, extensions } = message.content || {}
  const isMessageBlocked = useIsMessageBlocked(hubId, message, chatId)

  const isAdmin = useIsModerationAdmin()

  const displayedTime = showApproveButton
    ? message.struct.createdAtTime
    : message.struct.approvedInRootPostAtTime || message.struct.createdAtTime

  if (showApproveButton && message.struct.approvedInRootPost) return null
  if (!body && (!extensions || extensions.length === 0)) return null

  const imageExt = getPostExtensionProperties(
    extensions?.[0],
    'subsocial-image'
  )

  return (
    <div {...props} ref={ref} className={cx('relative flex', props.className)}>
      <ChatItemMenus
        menuIdPrefix={menuIdPrefix}
        chatId={chatId}
        messageId={message.id}
        enableChatMenu={enableChatMenu}
        hubId={hubId}
      >
        {(config) => (
          <SuperLikeWrapper postId={messageId} withPostReward={false}>
            {(props) => {
              return (
                <ChatItemMenuWrapper
                  config={config}
                  superLikeProps={props}
                  messageBubbleId={messageBubbleId}
                  disableSuperLike={disableSuperLike}
                >
                  <div
                    className={cx(
                      'flex flex-col gap-2 border-b border-border-gray py-2',
                      noBorder && 'border-none',
                      withWrapper &&
                        'h-full overflow-hidden rounded-2xl bg-slate-800 pt-2'
                    )}
                  >
                    <div className='flex items-center justify-between px-2'>
                      <div
                        className={cx(
                          'flex items-center gap-2 overflow-hidden'
                        )}
                      >
                        <AddressAvatar
                          address={ownerId}
                          className='flex-shrink-0 cursor-pointer'
                        />
                        <ProfilePreviewModalName
                          clipText
                          showModeratorChip
                          labelingData={{ chatId }}
                          messageId={message.id}
                          address={ownerId}
                          chatId={chatId}
                          hubId={hubId}
                          enableProfileModal={enableProfileModal}
                          className={cx(
                            'text-sm font-medium text-text-secondary'
                          )}
                        />
                        {inView && isAdmin && !showApproveButton && (
                          <ApprovedUserChip chatId={chatId} address={ownerId} />
                        )}
                      </div>
                      <ChatRelativeTime
                        isUpdated={message.struct.isUpdated}
                        createdAtTime={displayedTime}
                        className={cx('text-xs text-text-muted')}
                      />
                    </div>
                    <MediaLoader
                      containerClassName={cx(
                        'overflow-hidden w-full cursor-pointer',
                        {
                          ['h-full flex items-center justify-center']:
                            withWrapper,
                        }
                      )}
                      placeholderClassName={cx('w-full aspect-square')}
                      className='w-full object-contain'
                      src={imageExt?.image}
                    />
                    {body && (
                      <p
                        className={cx(
                          'whitespace-pre-wrap break-words px-2 text-base'
                        )}
                      >
                        {body}
                      </p>
                    )}
                    <div className='flex items-center justify-between px-2 py-0.5'>
                      {dummySuperLike ? (
                        <SuperLikeButton
                          {...dummySuperLike}
                          postId={message.id}
                          className={cx(dummySuperLike.className)}
                        />
                      ) : message.struct.approvedInRootPost ? (
                        <SuperLike
                          showWhenZero={true}
                          withPostReward
                          postId={message.id}
                          disabled={disableSuperLike}
                        />
                      ) : !isMessageBlocked ? (
                        <div className='flex rounded-full bg-background-light px-2 py-1 text-sm text-text/80'>
                          ⌛ Pending Review
                        </div>
                      ) : (
                        <div />
                      )}
                      {isAdmin && (
                        <UnapprovedMemeCount
                          address={message.struct.ownerId}
                          chatId={chatId}
                        />
                      )}
                    </div>
                    {(showApproveButton || showBlockButton) && (
                      <div className='flex items-center gap-2 px-2 [&>button]:w-full'>
                        {showBlockButton && (
                          <BlockUnblockMemeButton
                            chatId={chatId}
                            hubId={hubId}
                            message={message}
                          />
                        )}
                        {showApproveButton && (
                          <ApproveMemeButton
                            messageId={message.id}
                            chatId={chatId}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </ChatItemMenuWrapper>
              )
            }}
          </SuperLikeWrapper>
        )}
      </ChatItemMenus>
    </div>
  )
}

type ChatItemMenuWrapperProps = {
  config?: Parameters<FloatingWrapperProps['children']>[0]
  superLikeProps: {
    hasILiked: boolean
    isDisabled: boolean
    disabledCause: string
    superLikeCount: number
    handleClick: () => void
    postRewards?: PostRewards | undefined | null
  }
  children: React.ReactNode
  disableSuperLike?: boolean
  messageBubbleId?: string
}

const animateHeart = (x: number, y: number) => {
  const container = document.getElementById('__next')
  if (container) {
    const like = document.createElement('img')

    like.src = Thumbsup.src
    like.classList.add('big-floating-like')

    like.style.left = `${x - 50}px`
    like.style.top = `${y - 50}px`

    container.appendChild(like)

    like.addEventListener(
      'animationend',
      () => {
        like.remove()
      },
      { once: true }
    )
  }
}

const ChatItemMenuWrapper = ({
  config,
  superLikeProps,
  children,
  messageBubbleId,
  disableSuperLike,
}: ChatItemMenuWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { toggleDisplay, referenceProps } = config || {}
  const haptic = useHapticFeedbackRaw(true)

  const { hasILiked, isDisabled, handleClick } = superLikeProps
  const sendEvent = useSendEvent()

  const onLongPress = useLongTouch(
    (e) => {
      sendEvent('long_press_meme')
      if (isTouchDevice()) {
        toggleDisplay?.(e)
      }
    },
    { delay: 500 },
    {
      startAnimation: () => {
        if (containerRef.current) {
          containerRef.current.classList.add('scale-section')

          containerRef.current.addEventListener(
            'animationend',
            () => {
              if (containerRef.current) {
                containerRef.current.classList.remove('scale-section')
              }
            },
            { once: true }
          )
        }
      },
      endAnimation: () => {
        if (containerRef.current) {
          containerRef.current.classList.remove('scale-section')
        }
      },
    }
  )

  return (
    <div
      ref={containerRef}
      className={cx('relative w-full')}
      onContextMenu={(e) => {
        if (!isTouchDevice()) {
          e.preventDefault()
          toggleDisplay?.(e)
        }
      }}
      {...onLongPress}
      onDoubleClick={(e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isDisabled && !disableSuperLike && !hasILiked) {
          haptic?.result?.impactOccurred('medium')
          handleClick()
          animateHeart(e.clientX, e.clientY)
        }
      }}
      {...referenceProps}
      id={messageBubbleId}
    >
      {children}
    </div>
  )
}
