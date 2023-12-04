import { useRequestToken } from '@/services/api/mutation'
import {
  SendMessageParams,
  useSendMessage,
} from '@/services/subsocial/commentIds'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import useLoginOptions from './useLoginOptions'

type Params = SendMessageParams & {
  captchaToken: string | null
}
export default function useRequestTokenAndSendMessage(
  options?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const address = useMyMainAddress()
  const { promptUserForLogin } = useLoginOptions()

  const { mutateAsync: requestToken } = useRequestToken()
  const { mutateAsync: sendMessage } = useSendMessage()
  const login = useMyAccount((state) => state.login)

  const requestTokenAndSendMessage = async (params: Params) => {
    const { captchaToken, ...sendMessageParams } = params
    let usedAddress: string = address ?? ''
    if (!address) {
      const loginAddress = await promptUserForLogin()
      if (!loginAddress) return
      usedAddress = loginAddress
    }

    const promises: Promise<any>[] = [sendMessage(sendMessageParams)]
    if (captchaToken) {
      promises.push(requestToken({ address: usedAddress, captchaToken }))
    }

    await Promise.all(promises)
  }

  return useMutation(requestTokenAndSendMessage, options)
}
