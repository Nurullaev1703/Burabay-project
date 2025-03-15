import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/announcements/org-page/$announcementId')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/announcements/org-page/org-page/$adId"!</div>
}
