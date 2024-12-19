import { createFileRoute } from '@tanstack/react-router'
import { NewService } from '../../../pages/announcements/NewService'

export const Route = createFileRoute('/announcements/newService/')({
  component: NewService,
})
