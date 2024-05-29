import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useIsMounted from '@/hooks/useIsMounted'
import MainContent from '../chat/HomePage/epic-leaderboard/MainContent'

const StatsPage = () => {
  const isMounted = useIsMounted()

  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      {isMounted && <StatsPageContent />}
    </LayoutWithBottomNavigation>
  )
}

const StatsPageContent = () => {
  return <MainContent />
}

export default StatsPage
