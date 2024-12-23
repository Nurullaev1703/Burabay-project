import { createFileRoute, useParams } from '@tanstack/react-router'
import { StepSix } from '../../../pages/announcements/step-six/StepSix'

export const Route = createFileRoute(
  '/announcements/addAnnouncements/step-six/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: Route.id });
  return <StepSix id={id}/>
}
