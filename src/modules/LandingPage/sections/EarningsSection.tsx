import ActivitiesImage from '@/assets/graphics/landing/activities.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function EarningsSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-5xl', props.className)}
    >
      <div className='absolute -top-52 right-0 h-[855px] w-[855px] translate-x-1/2 rounded-full bg-[#5D88F0A8] blur-[200px]' />
      <div className='relative flex flex-col'>
        <h3 className='mb-10 text-center text-5xl font-bold'>
          What Others Earn
        </h3>
        <div className='grid grid-cols-2 gap-7'>
          <div className='flex flex-col rounded-3xl bg-white/5 p-5'>
            <span className='mb-2 text-xl text-[#FEEFFB]'>
              Earned by users and bloggers last month
            </span>
            <span className='text-5xl font-bold'>1M+ SUB</span>
            <span className='mt-4 text-xl'>≈ $10,234</span>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/5 p-5'>
            <span className='mb-2 text-xl text-[#FEEFFB]'>
              Earned by top users on a single post
            </span>
            <span className='text-5xl font-bold'>1000+ SUB</span>
            <span className='mt-4 text-xl'>≈ $11 per post</span>
          </div>
          <Image
            src={ActivitiesImage}
            className='col-span-2 w-full rounded-3xl'
            alt=''
          />
          <div className='col-span-2 flex items-center justify-between rounded-3xl bg-white/5 px-5 py-6'>
            <span className='text-2xl font-medium'>
              Check out the statistics of how others earn on our platform:
            </span>
            <Button variant='landingPrimary' className='text-lg' roundings='xl'>
              See Live Stats
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
