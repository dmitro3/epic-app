import Container from '@/components/Container'
import SkeletonFallback from '@/components/SkeletonFallback'
import TabButtons from '@/components/TabButtons'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import ChatContent from '@/modules/chat/HomePage/ChatContent'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { FaChevronLeft } from 'react-icons/fa6'
import {
  ChannelContentPageProvider,
  useChannelContentPageContext,
} from './context'

export default function ChannelContentPage({
  containerId,
}: {
  containerId: string
}) {
  return (
    <ChannelContentPageProvider containerId={containerId}>
      <LayoutWithBottomNavigation withFixedHeight className='relative'>
        <ChannelNavbar />
        <ChatContent />
      </LayoutWithBottomNavigation>
    </ChannelContentPageProvider>
  )
}

function ChannelNavbar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Details')
  const router = useRouter()

  const { contentContainer, isLoading } = useChannelContentPageContext()

  return (
    <>
      <nav className='flex h-14 items-center gap-2.5 bg-background-light px-3'>
        <FaChevronLeft
          onClick={() => {
            if (isAboutOpen) setIsAboutOpen(false)
            else router.push('/tg/channels')
          }}
          className='text-lg text-text-muted'
        />
        <div
          className='flex items-center gap-2.5'
          onClick={() => setIsAboutOpen(true)}
        >
          <SkeletonFallback
            isLoading={isLoading}
            className='h-9 w-9 rounded-full'
          >
            <Image
              src={contentContainer?.metadata.image ?? ''}
              alt=''
              width={100}
              height={100}
              className='h-9 w-9 rounded-full'
            />
          </SkeletonFallback>
          <span className='font-bold'>
            {isAboutOpen && 'About '}
            <SkeletonFallback
              isLoading={isLoading}
              className='inline-block w-16 align-middle'
            >
              {contentContainer?.metadata.title}
            </SkeletonFallback>{' '}
            Channel
          </span>
        </div>
        {!isAboutOpen && (
          <AiOutlineInfoCircle
            onClick={() => setIsAboutOpen(true)}
            className='ml-auto text-xl text-text-muted'
          />
        )}
      </nav>
      <Transition show={isAboutOpen}>
        <div className='absolute top-14 z-10 h-full w-full bg-background transition data-[closed]:translate-x-1/2 data-[closed]:opacity-0'>
          <div className='relative mb-8 h-40 w-full bg-background-light'>
            <div className='h-full w-full overflow-clip'>
              {contentContainer?.metadata.coverImage && (
                <Image
                  src={contentContainer?.metadata.coverImage ?? ''}
                  alt=''
                  width={1000}
                  height={1000}
                  className='h-full w-full scale-125 object-cover'
                />
              )}
            </div>
            <div className='absolute inset-x-0 bottom-0 h-10 w-full bg-gradient-to-b from-transparent to-background' />
            <div className='absolute bottom-2 left-2 translate-y-1/2 rounded-full bg-background p-1'>
              <SkeletonFallback
                isLoading={isLoading}
                className='h-[90px] w-[90px] rounded-full'
              >
                <Image
                  width={100}
                  height={100}
                  src={contentContainer?.metadata.image ?? ''}
                  className='h-[90px] w-[90px] rounded-full object-cover'
                  alt=''
                />
              </SkeletonFallback>
            </div>
          </div>
          <Container className='flex flex-col pt-6'>
            <span className='text-2xl font-bold'>
              <SkeletonFallback
                isLoading={isLoading}
                className='inline-block w-16 align-middle'
              >
                {contentContainer?.metadata.title}
              </SkeletonFallback>{' '}
              Channel
            </span>
            <TabButtons
              className='mt-6'
              tabs={['Details', 'Tasks']}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <div className='py-4'>
              {selectedTab === 'Details' && (
                <SkeletonFallback isLoading={isLoading} className='h-16 w-full'>
                  <p className='whitespace-pre-wrap leading-snug text-text-muted'>
                    {contentContainer?.metadata.description}
                  </p>
                </SkeletonFallback>
              )}
            </div>
          </Container>
        </div>
      </Transition>
    </>
  )
}
