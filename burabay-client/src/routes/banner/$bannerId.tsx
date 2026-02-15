import { createFileRoute } from '@tanstack/react-router'
import BannerViewPage from '../../pages/banner/BannerViewPage'

export const Route = createFileRoute('/banner/$bannerId')({
  component: BannerViewPage,
})
