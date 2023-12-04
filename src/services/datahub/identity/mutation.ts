import { DatahubPostMutationBody } from '@/pages/api/datahub/post'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import mutationWrapper from '@/subsocial-query/base'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import {
  SocialCallDataArgs,
  socialCallName,
  SynthCreateLinkedIdentityCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import axios from 'axios'
import { createSocialDataEventPayload, DatahubParams } from '../utils'

async function linkIdentity(
  params: DatahubParams<SocialCallDataArgs<'synth_create_linked_identity'>>
) {
  const { id, provider } = params.args
  params.isOffchain = true

  const eventArgs: SynthCreateLinkedIdentityCallParsedArgs = {
    id,
    provider,
  }
  const input = createSocialDataEventPayload(
    socialCallName.synth_create_linked_identity,
    params,
    eventArgs
  )

  await axios.post<any, any, DatahubPostMutationBody>('/api/datahub/post', {
    action: 'link-identity',
    payload: input as any,
  })
}

export const useLinkIdentity = mutationWrapper(
  async (data: SynthCreateLinkedIdentityCallParsedArgs) => {
    await linkIdentity({
      ...getCurrentWallet(),
      args: data,
    })
  },
  {
    onMutate: () => preventWindowUnload(),
    onError: () => allowWindowUnload(),
    onSuccess: () => allowWindowUnload(),
  }
)
