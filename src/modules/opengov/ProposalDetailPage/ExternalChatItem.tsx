import PolkassemblyIcon from '@/assets/icons/polkassembly.svg'
import SubsquareIcon from '@/assets/icons/subsquare.svg'
import AddressAvatar from '@/components/AddressAvatar'
import MdRenderer from '@/components/MdRenderer'
import Name from '@/components/Name'
import ChatRelativeTime from '@/components/chats/ChatItem/ChatRelativeTime'
import { scrollToMessageElement } from '@/components/chats/utils'
import PopOver from '@/components/floating/PopOver'
import useRandomColor from '@/hooks/useRandomColor'
import { ProposalComment } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export type ExternalChatItemProps = ComponentProps<'div'> & {
  comment: ProposalComment
  bg?: 'background-light' | 'background'
  containerRef?: React.RefObject<HTMLDivElement>
}

export function getExternalMessageItemDOMId(commentId: string) {
  return `external-message-item-${commentId}`
}

export default function ExternalChatItem({
  comment,
  bg = 'background-light',
  containerRef,
  ...props
}: ExternalChatItemProps) {
  if (!comment.content) return null

  return (
    <div
      {...props}
      className={cx(
        'relative flex w-11/12 items-start justify-start gap-2',
        props.className
      )}
    >
      {comment.profile?.image ? (
        <Image
          src={comment.profile.image}
          alt=''
          width={50}
          height={50}
          className='h-9 w-9 flex-shrink-0 rounded-full object-cover'
        />
      ) : (
        <AddressAvatar
          address={comment.ownerId}
          className='flex-shrink-0 cursor-pointer'
        />
      )}
      <div className={cx('relative flex flex-col')}>
        <div
          className={cx(
            'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl px-2.5 py-1.5',
            bg === 'background' ? 'bg-background' : 'bg-background-light'
          )}
          id={getExternalMessageItemDOMId(comment.id)}
        >
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-baseline justify-start gap-2 overflow-hidden'>
              <span className='font-medium'>
                <ExternalMessageName comment={comment} />
              </span>
              <ChatRelativeTime
                createdAtTime={comment.createdAt}
                className={cx(
                  'text-xs text-text-muted [&:not(:last-child)]:mr-1'
                )}
              />
            </div>
            <PopOver
              triggerClassName='ml-auto text-text-muted'
              panelSize='sm'
              placement='top'
              yOffset={6}
              triggerOnHover
              trigger={
                comment.source === 'polkassembly' ? (
                  <PolkassemblyIcon />
                ) : (
                  <SubsquareIcon />
                )
              }
            >
              <p>
                Comment from{' '}
                {comment.source === 'polkassembly'
                  ? 'Polkassembly'
                  : 'Subsquare'}
              </p>
            </PopOver>
          </div>
          {comment.parentComment && (
            <ExternalChatRepliedMessagePreview
              containerRef={containerRef}
              parentComment={comment.parentComment}
            />
          )}
          <div className='prose break-words text-base'>
            <MdRenderer source={comment.content} plain />
          </div>
        </div>
      </div>
    </div>
  )
}

function ExternalChatRepliedMessagePreview({
  parentComment,
  containerRef,
}: {
  parentComment: ProposalComment
  containerRef?: React.RefObject<HTMLDivElement>
}) {
  const textColor = useRandomColor(
    parentComment.ownerId || parentComment.username || parentComment.id
  )

  if (!parentComment.content) return null

  return (
    <div
      className={cx(
        'flex cursor-pointer items-center gap-2 overflow-hidden border-l-2 pl-2 text-sm'
      )}
      style={{
        borderColor: textColor,
      }}
      onClick={(e) => {
        const element = containerRef?.current?.querySelector(
          '#' + getExternalMessageItemDOMId(parentComment.id)
        )
        if (element && containerRef?.current) {
          scrollToMessageElement(element as any, containerRef.current, {
            shouldHighlight: true,
            smooth: true,
          })
        }
      }}
    >
      <div className='flex flex-col overflow-hidden'>
        <span className='font-medium'>
          <ExternalMessageName comment={parentComment} />
        </span>
        <span className='line-clamp-1 opacity-75'>{parentComment.content}</span>
      </div>
    </div>
  )
}

function ExternalMessageName({ comment }: { comment: ProposalComment }) {
  const textColor = useRandomColorForComment(comment)
  if (comment.username) {
    return <span style={{ color: textColor }}>{comment.username}</span>
  }
  return <Name address={comment.ownerId} />
}

function useRandomColorForComment(comment: ProposalComment) {
  return useRandomColor(comment.ownerId ?? comment.username ?? comment.id)
}
