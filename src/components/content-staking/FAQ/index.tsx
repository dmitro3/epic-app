import Accordion from '@/components/Accordion'
import SectionWrapper from '../utils/SectionWrapper'

const items = [
  {
    title: 'What is staking?',
    content: (
      <>
        The Creator Staking system has two main objectives: grow the network,
        and improve curation. Here, we will look at how the system functions.
        <br /> <br />
        Heavy inspiration was taken from the Dapp Staking system implemented on
        Astar Network, aimed at incentivizing developers to build applications
        on the network. Creator Staking expands this idea to include creators of
        content and communities, as those are also very valuable to Subsocial.
      </>
    ),
  },
  {
    title: 'What is the minimum amount of tokens required to stake?',
    content: (
      <>
        The Creator Staking system has two main objectives: grow the network,
        and improve curation. Here, we will look at how the system functions.
        <br /> <br />
        Heavy inspiration was taken from the Dapp Staking system implemented on
        Astar Network, aimed at incentivizing developers to build applications
        on the network. Creator Staking expands this idea to include creators of
        content and communities, as those are also very valuable to Subsocial.
      </>
    ),
  },
  {
    title: 'What are the rewards for staking?',
    content: (
      <>
        The Creator Staking system has two main objectives: grow the network,
        and improve curation. Here, we will look at how the system functions.
        <br /> <br />
        Heavy inspiration was taken from the Dapp Staking system implemented on
        Astar Network, aimed at incentivizing developers to build applications
        on the network. Creator Staking expands this idea to include creators of
        content and communities, as those are also very valuable to Subsocial.
      </>
    ),
  },
  {
    title: 'How long does it take to receive staking rewards?',
    content: (
      <>
        The Creator Staking system has two main objectives: grow the network,
        and improve curation. Here, we will look at how the system functions.
        <br /> <br />
        Heavy inspiration was taken from the Dapp Staking system implemented on
        Astar Network, aimed at incentivizing developers to build applications
        on the network. Creator Staking expands this idea to include creators of
        content and communities, as those are also very valuable to Subsocial.
      </>
    ),
  },
]

const FAQSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='text-2xl font-bold leading-none text-text'>FAQ</div>
      <SectionWrapper className='px-4 py-6'>
        <div>
          <Accordion items={items} />
        </div>
      </SectionWrapper>
    </div>
  )
}

export default FAQSection
