import { createFileRoute } from '@tanstack/react-router'
import { NewService } from '../../../pages/announcements/NewService'

export const Route = createFileRoute('/announcements/newService/$adId')({
  component: () => <NewService adId={Route.useParams().adId} />,
})
