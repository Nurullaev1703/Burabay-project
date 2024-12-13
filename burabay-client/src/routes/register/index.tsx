import { createFileRoute } from '@tanstack/react-router'
import { RegisterBusiness } from '../../pages/register/RegisterBusiness'

export const Route = createFileRoute("/register/")({
  component: RegisterBusiness,
});
