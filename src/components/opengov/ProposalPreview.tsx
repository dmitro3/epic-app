import Send from '@/assets/icons/send.svg'
import { env } from '@/env.mjs'
import { Proposal } from '@/server/opengov/mapper'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { summarizeMdAndHtml } from '@/utils/strings'
import { FaRegComment } from 'react-icons/fa6'
import AddressAvatar, { IdenticonAvatar } from '../AddressAvatar'
import Button from '../Button'
import LinkText from '../LinkText'
import Name from '../Name'
import ProfilePreview from '../ProfilePreview'
import { Skeleton } from '../SkeletonFallback'
import ChatLastMessage from '../chats/ChatPreview/ChatLastMessage'
import CustomLink from '../referral/CustomLink'
import ProposalStatus from './ProposalStatus'
import VoteSummary from './VoteSummary'

export default function ProposalPreview({
  proposal,
  className,
}: {
  proposal: Proposal
  className?: string
}) {
  return (
    <div className={cx('rounded-2xl bg-background-light p-4', className)}>
      <div className='flex h-full flex-col justify-between'>
        <div className='flex flex-col gap-2'>
          <ProfilePreview
            withPolkadotIdentity
            address={proposal.proposer}
            showAddress={false}
            className='gap-1'
            nameClassName='text-sm text-text-muted'
            avatarClassName='h-5 w-5'
          />
          <LinkText href={`/opengov/${proposal.id}`} className='font-medium'>
            <span className='text-text-muted'>#</span>
            {proposal.id} &middot; {proposal.title}
          </LinkText>
          <div className='flex items-center'>
            <span className='line-clamp-1 text-text-muted'>
              {summarizeMdAndHtml(proposal.content)}
            </span>
            <LinkText
              href={`/opengov/${proposal.id}`}
              variant='primary'
              className='flex-shrink-0 whitespace-nowrap'
            >
              Read more
            </LinkText>
          </div>
        </div>

        <div className='mb-3 mt-4 grid grid-cols-[1fr_1fr_1fr_max-content] items-center gap-4 rounded-2xl bg-background px-4 pb-4 pt-3'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-text-muted'>Status</span>
            <ProposalStatus proposal={proposal} />
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-text-muted'>Requested</span>
            <span className='font-medium'>
              {formatBalanceWithDecimals(proposal.requested, {
                precision: 2,
              })}{' '}
              DOT
            </span>
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-text-muted'>Voted</span>
            <span className='font-medium'>
              {formatBalanceWithDecimals(proposal.tally.support, {
                precision: 2,
              })}{' '}
              DOT
            </span>
          </div>
          <VoteSummary className='h-14 w-14' proposal={proposal} />
        </div>
        <div>
          <CommentsSection proposal={proposal} />
        </div>
      </div>
    </div>
  )
}

function CommentsSection({ proposal }: { proposal: Proposal }) {
  const { data: postMetadata, isLoading: isLoadingLatestComment } =
    getPostMetadataQuery.useQuery(proposal.chatId ?? '', {
      enabled: !!proposal.chatId,
    })
  const lastCommentId = postMetadata?.lastCommentId
  const { data: message } = getPostQuery.useQuery(lastCommentId ?? '', {
    enabled: !!lastCommentId,
  })

  if (!proposal.chatId) {
    return <NoComments proposal={proposal} />
  }
  if (isLoadingLatestComment) {
    return (
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9' />
          <Skeleton className='w-16' />
        </div>
        <Button
          size='circle'
          variant='mutedOutline'
          className='opacity-100'
          disabled
        >
          <Send />
        </Button>
      </div>
    )
  }
  if (!postMetadata?.postId) {
    return <NoComments proposal={proposal} />
  }

  return (
    <LastCommentItem
      proposal={proposal}
      summary={postMetadata.summary}
      createdAtTime={postMetadata.createdAtTime}
      ownerId={message?.struct.ownerId}
    />
  )
}

function NoComments({ proposal }: { proposal: Proposal }) {
  const myAddress = useMyMainAddress()

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {myAddress ? (
          <AddressAvatar address={myAddress ?? ''} className='flex-shrink-0' />
        ) : (
          <IdenticonAvatar
            // just a random address to display random identicon for unlogged in user
            value='5Fv4YbSn89Fj92zDJAH583mH3r8hKkxdQJwHod28ZgVNcoym'
            className='h-9 w-9 flex-shrink-0'
          />
        )}
        <LinkText href={`/opengov/${proposal.id}?chat=true`} className='w-full'>
          <span className='text-text-muted'>Write a first comment...</span>
        </LinkText>
      </div>
      <Button
        size='circle'
        variant='mutedOutline'
        disabled
        disabledStyle='subtle'
      >
        <Send />
      </Button>
    </div>
  )
}

function LastCommentItem({
  proposal,
  summary,
  createdAtTime,
  ownerId,
}: {
  proposal: Proposal
  summary: string
  ownerId?: string
  createdAtTime?: number
}) {
  if (!proposal.chatId) return null

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm text-text-muted'>Latest comment:</span>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {ownerId ? (
            <AddressAvatar address={proposal.proposer} />
          ) : (
            <Skeleton className='h-9 w-9' />
          )}
          <div className='flex flex-col items-start gap-0.5 overflow-hidden'>
            <span className='flex items-center gap-2'>
              {ownerId ? (
                <Name
                  withPolkadotIdentity
                  className='text-sm font-medium'
                  address={ownerId}
                />
              ) : (
                <Skeleton className='w-12' />
              )}
              <span className='text-xs text-text-muted'>
                {createdAtTime ? getTimeRelativeToNow(createdAtTime) : ''}
              </span>
            </span>
            <ChatLastMessage
              className='text-base text-text'
              chatId={proposal.chatId}
              defaultDesc={summary}
              hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
            />
          </div>
        </div>
        <CustomLink
          href={`/opengov/${proposal.id}?chat=true`}
          className='flex-shrink-0'
        >
          <Button
            variant='mutedOutline'
            size='sm'
            className='flex items-center gap-2 py-2 text-text-muted !ring-text-muted'
          >
            <FaRegComment />
            <span className='relative -top-px'>140</span>
          </Button>
        </CustomLink>
      </div>
    </div>
  )
}
