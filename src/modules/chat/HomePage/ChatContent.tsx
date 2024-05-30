import Shield from '@/assets/icons/shield.svg'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import ChatRoom from '@/components/chats/ChatRoom'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { useExtensionData } from '@/stores/extension'
import { useState } from 'react'
import { LuPlusCircle } from 'react-icons/lu'

type Props = {
  hubId: string
  chatId: string
  className?: string
}

export default function ChatContent({ chatId, hubId, className }: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { mutate } = useUpsertPost()
  const openExtensionModal = useExtensionData.use.openExtensionModal()
  return (
    <>
      <RulesModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      />
      <ChatRoom
        asContainer
        chatId={chatId}
        hubId={hubId}
        className='overflow-hidden'
        customAction={
          <div className='grid grid-cols-[max-content_1fr] gap-2'>
            <Button
              size='lg'
              className='flex items-center justify-center gap-2'
              variant='bgLighter'
              onClick={() => setIsOpenModal(true)}
            >
              <Shield className='relative top-px text-text-muted' />
              <span className='text-text'>Rules</span>
            </Button>
            <Button
              className='flex items-center justify-center gap-2'
              size='lg'
              onClick={() => {
                mutate(
                  augmentDatahubParams({
                    image: '',
                    spaceId: '0x89f814f1045fcc797b2b3d311abee22c',
                    title: 'Test Post',
                  })
                )
                openExtensionModal('subsocial-image', null)
              }}
            >
              <LuPlusCircle className='relative top-px text-lg' />
              <span>Post meme</span>
            </Button>
          </div>
        }
      />
    </>
  )
}

function RulesModal(props: ModalFunctionalityProps) {
  return (
    <Modal {...props} title='Rules' withCloseButton>
      <div className='flex flex-col gap-6'>
        <ul className='flex list-none flex-col gap-3.5 text-text-muted'>
          <li>🤣 Post funny memes</li>
          <li>🌟 Be polite and respect others</li>
          <li>🚫 No sharing personal information</li>
          <li>🚫 No adult content</li>
          <li>🚫 No spam, no scam</li>
          <li>🚫 No violence</li>
        </ul>
        <Notice noticeType='warning' className='font-medium'>
          ⚠️ All those who break these rules will be banned and will lose all
          their points.
        </Notice>
        <LinkText variant='secondary' className='text-center'>
          Read the detailed information
        </LinkText>
        <Button size='lg' onClick={() => props.closeModal()}>
          Got it!
        </Button>
      </div>
    </Modal>
  )
}
