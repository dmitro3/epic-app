import { getPostId } from '@/constants/space'
import ChatPage from '@/modules/_chats/ChatPage'
import {
  getCommentIdsQueryKey,
  getCommentQuery,
} from '@/services/subsocial/queries'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonStaticProps<{
  dehydratedState: any
}>({}, async () => {
  const subsocialApi = await getSubsocialApi()
  const postId = getPostId()
  const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(postId)
  const posts = await subsocialApi.findPublicPosts(commentIds)

  const queryClient = new QueryClient()
  await queryClient.fetchQuery(getCommentIdsQueryKey(postId), () => commentIds)
  await Promise.all(
    posts.map(async (post) => {
      await queryClient.fetchQuery(
        getCommentQuery.getQueryKey(post.id),
        () => post
      )
    })
  )

  return {
    dehydratedState: dehydrate(queryClient),
  }
})

export default ChatPage
