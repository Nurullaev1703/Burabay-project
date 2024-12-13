import { createFileRoute } from '@tanstack/react-router'
import { BusinessInfo } from '../../pages/register/BusinessInfo'

export const Route = createFileRoute("/register/business/$email")({
  component: BusinessInfoRoute
});

function BusinessInfoRoute(){
    const {email} = Route.useParams()

    return <BusinessInfo email={email} />
}