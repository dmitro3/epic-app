import Send from '@/assets/icons/send.svg'
import Button from '@/components/Button'
import TextArea from '@/components/inputs/TextArea'
import Toast from '@/components/Toast'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'
import CaptchaModal from './CaptchaModal'

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  postId: string
  spaceId: string
  onSubmit?: () => void
}

const ESTIMATED_ENERGY_FOR_ONE_TX = 100_000_000

function processMessage(message: string) {
  return message.trim()
}

export default function ChatForm({
  className,
  postId,
  spaceId,
  onSubmit,
  ...props
}: ChatFormProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const hasEnoughEnergy = useMyAccount(
    (state) => (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
  )

  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)
  const [message, setMessage] = useState('')
  const { mutate: sendMessage, error } = useSendMessage()

  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => <IoWarningOutline className={classNames} />}
          title='Sending message failed. Please try again'
          description={error?.message}
        />
      ))
  }, [error])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const processedMessage = processMessage(message)
    if (!processedMessage) return
    if (isLoggedIn && hasEnoughEnergy) {
      setMessage('')
      sendMessage({ message: processedMessage, rootPostId: postId, spaceId })
      textAreaRef.current?.focus()
      onSubmit?.()
    } else {
      setIsOpenCaptcha(true)
    }
  }

  const isDisabled = !processMessage(message)

  return (
    <>
      <form
        onSubmit={handleSubmit}
        {...props}
        className={cx('flex w-full', className)}
      >
        <TextArea
          ref={textAreaRef}
          value={message}
          autoFocus
          onChange={(e) => setMessage((e.target as any).value)}
          placeholder='Message...'
          rows={1}
          autoComplete='off'
          autoCapitalize='off'
          autoCorrect='off'
          spellCheck='false'
          variant='fill'
          pill
          rightElement={(classNames) => (
            <Button
              type='submit'
              size='circle'
              disabled={isDisabled}
              withDisabledStyles={false}
              variant={isDisabled ? 'mutedOutline' : 'primary'}
              className={cx(classNames)}
            >
              <Send className='relative top-px h-4 w-4' />
            </Button>
          )}
        />
      </form>
      <CaptchaModal
        onSubmit={() => {
          onSubmit?.()
          setMessage('')
        }}
        isOpen={isOpenCaptcha}
        closeModal={() => setIsOpenCaptcha(false)}
        message={processMessage(message)}
        rootPostId={postId}
        spaceId={spaceId}
      />
    </>
  )
}
