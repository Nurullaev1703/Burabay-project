import { createFileRoute } from '@tanstack/react-router'
import { AcceptEmail } from '../../pages/auth/AcceptEmail';
import { roleService } from '../../services/storage/Factory';
import { ROLE_TYPE } from '../../pages/auth/model/auth-model';

export const Route = createFileRoute('/auth/accept/$email')({
  component: AcceptPhoneRoute,
})

function AcceptPhoneRoute() {
  const { email } = Route.useParams()
  if(roleService.hasValue()){
    return <AcceptEmail email={email} role={ROLE_TYPE.BUSINESS}/>;
  }
  return <AcceptEmail email={email} />;
}
